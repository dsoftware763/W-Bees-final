import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatPanelService } from 'app/layout/components/chat-panel/chat-panel.service';
import { environment } from 'environments/environment';
@Component({
    selector: 'chat-panel',
    templateUrl: './chat-panel.component.html',
    styleUrls: ['./chat-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatPanelComponent implements OnInit, AfterViewInit, OnDestroy {
    API = environment.API;
    dummyPic = 'assets/images/avatars/profile.jpg';
    contacts: any[];
    chat: any;
    selectedContact: any;
    sidebarFolded: boolean;
    user: any;

    wbContacts: any[];
    wbChat: any;
    wbUser: any;
    wbUserId: any;
    authToken: any;

    @ViewChild('replyForm', { static: false })
    private _replyForm: NgForm;

    @ViewChild('replyInput', { static: false })
    private _replyInput: ElementRef;

    @ViewChildren(FusePerfectScrollbarDirective)
    private _fusePerfectScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private _chatViewScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatPanelService} _chatPanelService
     * @param {HttpClient} _httpClient
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        private _chatPanelService: ChatPanelService,
        private _httpClient: HttpClient,
        private _fuseSidebarService: FuseSidebarService
    ) {
        // Set the defaults
        this.selectedContact = null;
        this.sidebarFolded = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // get userId from localStorage
        if (localStorage.getItem('user-details') !== undefined) {
            this.wbUserId = JSON.parse(localStorage.getItem('user-details')).id;
            this.authToken = localStorage.getItem('feathers-jwt');
            this._chatPanelService.wbLoadContacts(this.wbUserId).then(() => {
                this.wbContacts = this._chatPanelService.wbContacts;
            });
        }
        // Load the contacts
        this._chatPanelService.loadContacts().then(() => {

            this.contacts = this._chatPanelService.contacts;
            this.user = this._chatPanelService.user;
        });

        // Subscribe to the foldedChanged observable
        this._fuseSidebarService.getSidebar('chatPanel').foldedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((folded) => {
                this.sidebarFolded = folded;
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        this._chatViewScrollbar = this._fusePerfectScrollbarDirectives.find((directive) => {
            return directive.elementRef.nativeElement.id === 'messages';
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chat for the replies
     */
    private _prepareChatForReplies(): void {
        setTimeout(() => {

            // Focus to the reply input
            // this._replyInput.nativeElement.focus();

            // Scroll to the bottom of the messages list
            if (this._chatViewScrollbar) {
                this._chatViewScrollbar.update();

                setTimeout(() => {
                    this._chatViewScrollbar.scrollToBottom(0);
                });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fold the temporarily unfolded sidebar back
     */
    foldSidebarTemporarily(): void {
        this._fuseSidebarService.getSidebar('chatPanel').foldTemporarily();
    }

    /**
     * Unfold the sidebar temporarily
     */
    unfoldSidebarTemporarily(): void {
        this._fuseSidebarService.getSidebar('chatPanel').unfoldTemporarily();
    }

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpen(): void {
        this._fuseSidebarService.getSidebar('chatPanel').toggleOpen();
    }

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean {
        return (
            message.who === this.selectedContact.id &&
            ((this.chat[i + 1] && this.chat[i + 1].who !== this.selectedContact.id) || !this.chat[i + 1])
        );
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean {
        return (i === 0 || this.chat[i - 1] && this.chat[i - 1].who !== message.who);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean {
        return (i === this.chat.length - 1 || this.chat[i + 1] && this.chat[i + 1].who !== message.who);
    }

    /**
     * Toggle chat with the contact
     *
     * @param contact
     */
    toggleChat(contact): void {
        // If the contact equals to the selectedContact,
        // that means we will deselect the contact and
        // unload the chat
        if (this.selectedContact && contact.id === this.selectedContact.id) {
            // Reset
            this.resetChat();
        }
        // Otherwise, we will select the contact, open
        // the sidebar and start the chat
        else {
            // Unfold the sidebar temporarily
            this.unfoldSidebarTemporarily();

            // Set the selected contact
            this.selectedContact = contact;

            // Load the chat
            // this._chatPanelService.getChat(contact.id).then((chat) => {
            this._chatPanelService.wbGetChat(contact.id).then(() => {

                // Set the chat
                // this.chat = chat;

                this.getChatList(this.selectedContact.id);

                // Prepare the chat for the replies
                this._prepareChatForReplies();
            });
        }
    }

    /**
     * Remove the selected contact and unload the chat
     */
    resetChat(): void {
        // Set the selected contact as null
        this.selectedContact = null;

        // Set the chat as null
        this.chat = null;
    }

    /**
     * Reply
     */
    reply(event): void {
        event.preventDefault();

        if (!this._replyForm.form.value.message) {
            return;
        }

        // Message
        const message = {
            messageText: this._replyForm.form.value.message,
            status: 'sent',
            sender: this.wbUserId,
            receiver: this.selectedContact.details.id,
            conversationId: this.selectedContact.id
        };
        // const message = {
        //     who    : this.user.id,
        //     message: this._replyForm.form.value.message,
        //     time   : new Date().toISOString()
        // };

        // Add the message to the chat
        // this.chat.dialog.push(message);
        this._chatPanelService.sendMessage(message, this.authToken).then(() => {
            // Reset the reply form
            this._replyForm.reset();

            this.getChatList(this.selectedContact.id);
            // this._chatPanelService.wbGetChat(message.conversationId).then(() => {
            //     this.chat = this._chatPanelService.chats;
            // });

        });



        // Update the server
        this._chatPanelService.updateChat(this.chat.id, this.chat.dialog).then(response => {

            // Prepare the chat for the replies
            this._prepareChatForReplies();
        });
    }

    getChatList = (conversationId) => {
        this._chatPanelService.wbGetChat(conversationId).then(() => {
            this.chat = this._chatPanelService.chats;
        });
    }
}
