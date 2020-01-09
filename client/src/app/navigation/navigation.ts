import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'jobs',
        title    :  'Jobs',
        type     :  'group',
        children :  [
            {
                id      :   'my-jobs',
                title   :   'My Jobs',
                type    :   'item',
                icon    :   'work',
                url     :   '/jobs/my-jobs',
            },
            {
                id      :   'add-new-job',
                title   :   'Add a new job',
                type    :   'item',
                icon    :   'assignment',
                url     :   '/jobs/add-job',
            }
        ]
    },
    {
        id       : 'bidders',
        title    : 'Bidders',
        type     : 'group',
        children : [
            {
                id       : 'near-by-bidders',
                title    : 'Near By Bidders',
                type     : 'item',
                icon     : 'near_me',
                url      : '/bidders/nearby',
            }
        ]
    }
];

export const navigationSeeker: FuseNavigation[] = [
    {
        id       : 'jobs',
        title    : 'Jobs',
        type     : 'group',
        children : [
            {
                id       : 'near-by-jobs',
                title    : 'Near By Jobs',
                type     : 'item',
                icon     : 'near_me',
                url      : '/bidder/near-by-jobs',
            }
        ]
    },
    {
        id       : 'bids',
        title    : 'Bids',
        type     : 'group',
        children : [
            {
                id       : 'my-bids',
                title    : 'My Bids',
                type     : 'item',
                icon     : 'email',
                url      : '/bidder/my-bids',
            }
        ]
    }
];
