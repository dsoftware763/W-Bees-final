import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { Feathers } from 'feather.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnakBarService } from '../../../services/snak-bar.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class VerifyComponent implements OnInit {

  token: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snakBar: SnakBarService,
    private feathers: Feathers
  ) {
    this._fuseConfigService.config = {
        layout: {
            navbar   : {
                hidden: true
            },
            toolbar  : {
                hidden: true
            },
            footer   : {
                hidden: true
            },
            sidepanel: {
                hidden: true
            }
        }
    };

    this.activatedRoute.queryParams.subscribe(params => {
        this.token = params['token'];
    });
   }

  ngOnInit(): void {
      this.feathers.create('authManagement', {
        action: 'verifySignupLong',
        value: this.token
      })
      .then(res => {
        this.snakBar.success('Your accoount is verified successfully!!!');
        setTimeout(() => { this.router.navigate(['/login']); }, 2000);
      }, err => {
        this.snakBar.success(err);
      });
  }

}
