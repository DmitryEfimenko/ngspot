"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[505],{9505:(d,u,a)=>{a.r(u),a.d(u,{default:()=>D});var l=a(177),s=a(9417),c=a(2102),h=a(9213),g=a(4738),M=a(5599),v=a(4085),e=a(4438),x=a(6600),C=a(8486);let F=(()=>{class o extends C.t1{constructor(){super(...arguments),this.defaultErrorStateMatcher=(0,e.WQX)(x.es),this.formField=(0,e.WQX)(c.xb,{optional:!0}),this._required=!1,this.errorState=!1,this.parentForm=(0,e.WQX)(s.cV,{optional:!0}),this.parentFormGroup=(0,e.WQX)(s.j4,{optional:!0})}get placeholder(){return this._placeholder}set placeholder(t){this._placeholder=t,this.stateChanges.next()}get empty(){return!this.value}get shouldLabelFloat(){return this.focused||!this.empty}get required(){return this._required}set required(t){this._required=(0,v.he)(t),this.stateChanges.next()}ngDoCheck(){this.updateErrorState()}updateErrorState(){const t=this.ngControl?this.ngControl.control:null;if(!t)return;const n=this.errorState,p=(this.errorStateMatcher??this.defaultErrorStateMatcher).isErrorState(t,this.parentFormGroup??this.parentForm);p!==n&&(this.errorState=p,this.stateChanges.next())}static#e=this.\u0275fac=(()=>{let t;return function(r){return(t||(t=e.xGo(o)))(r||o)}})();static#t=this.\u0275dir=e.FsC({type:o,hostVars:2,hostBindings:function(n,r){2&n&&e.AVh("floating",r.shouldLabelFloat)},inputs:{errorStateMatcher:"errorStateMatcher",placeholder:"placeholder",required:"required",userAriaDescribedBy:[e.Mj6.None,"aria-describedby","userAriaDescribedBy"]},features:[e.Vt3]})}return o})();var y=a(6354);class f{constructor(b,t,n){this.area=b,this.exchange=t,this.subscriber=n}}const T=["area"],V=["exchange"],I=["subscriber"];let E=(()=>{class o extends F{constructor(){super(...arguments),this._formBuilder=(0,e.WQX)(s.ok),this.viewModel=this._formBuilder.group({area:["",[s.k0.required,s.k0.minLength(3),s.k0.maxLength(3)]],exchange:["",[s.k0.required,s.k0.minLength(3),s.k0.maxLength(3)]],subscriber:["",[s.k0.required,s.k0.minLength(4),s.k0.maxLength(4)]]}),this.outerToInner=t=>t.pipe((0,y.T)(n=>n??new f("","","")))}get empty(){const{value:{area:t,exchange:n,subscriber:r}}=this.viewModel;return!t&&!n&&!r}autoFocusPrev(t,n){t.value.length<1&&this.focusMonitor.focusVia(n,"program")}setDescribedByIds(t){this.hostEl.querySelector(".example-tel-input-container")?.setAttribute("aria-describedby",t.join(" "))}onContainerClick(){this.focusMonitor.focusVia(this.viewModel.controls.subscriber.valid||this.viewModel.controls.exchange.valid?this.subscriberInput:this.viewModel.controls.area.valid?this.exchangeInput:this.areaInput,"program")}static#e=this.\u0275fac=(()=>{let t;return function(r){return(t||(t=e.xGo(o)))(r||o)}})();static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ngs-tel-input"]],viewQuery:function(n,r){if(1&n&&(e.GBs(T,5),e.GBs(V,5),e.GBs(I,5)),2&n){let i;e.mGM(i=e.lsd())&&(r.areaInput=i.first),e.mGM(i=e.lsd())&&(r.exchangeInput=i.first),e.mGM(i=e.lsd())&&(r.subscriberInput=i.first)}},standalone:!0,features:[e.Jv_([{provide:c.qT,useExisting:o}]),e.Vt3,e.aNF],decls:11,vars:2,consts:[["area",""],["exchange",""],["subscriber",""],["role","group",1,"example-tel-input-container",3,"formGroup"],["formControlName","area","size","3","maxLength","3","aria-label","Area code",1,"example-tel-input-element"],[1,"example-tel-input-spacer"],["formControlName","exchange","maxLength","3","size","3","aria-label","Exchange code",1,"example-tel-input-element",3,"keyup.backspace"],["formControlName","subscriber","maxLength","4","size","4","aria-label","Subscriber number",1,"example-tel-input-element",3,"keyup.backspace"]],template:function(n,r){if(1&n){const i=e.RV6();e.j41(0,"div",3),e.nrm(1,"input",4,0),e.j41(3,"span",5),e.EFF(4,"\u2013"),e.k0s(),e.j41(5,"input",6,1),e.bIt("keyup.backspace",function(){e.eBV(i);const m=e.sdS(2);return e.Njj(r.autoFocusPrev(r.viewModel.controls.exchange,m))}),e.k0s(),e.j41(7,"span",5),e.EFF(8,"\u2013"),e.k0s(),e.j41(9,"input",7,2),e.bIt("keyup.backspace",function(){e.eBV(i);const m=e.sdS(6);return e.Njj(r.autoFocusPrev(r.viewModel.controls.subscriber,m))}),e.k0s()()}2&n&&(e.Y8G("formGroup",r.viewModel),e.BMQ("aria-labelledby",null==r.formField?null:r.formField.getLabelId()))},dependencies:[s.X1,s.me,s.BC,s.cb,s.j4,s.JD],styles:[".example-tel-input-container[_ngcontent-%COMP%]{display:flex}.example-tel-input-element[_ngcontent-%COMP%]{border:none;background:none;padding:0;outline:none;font:inherit;text-align:center}.example-tel-input-spacer[_ngcontent-%COMP%]{opacity:0;transition:opacity .2s}.floating[_nghost-%COMP%]   .example-tel-input-spacer[_ngcontent-%COMP%]{opacity:1}"]})}return o})();function k(o,b){if(1&o){const t=e.RV6();e.qex(0),e.j41(1,"mat-form-field")(2,"mat-label"),e.EFF(3,"Phone number"),e.k0s(),e.j41(4,"ngs-tel-input",2),e.mxI("ngModelChange",function(r){e.eBV(t);const i=e.XpG();return e.DH7(i.tel,r)||(i.tel=r),e.Njj(r)}),e.k0s(),e.j41(5,"mat-icon",3),e.EFF(6,"phone"),e.k0s(),e.j41(7,"mat-hint"),e.EFF(8,"Include area code"),e.k0s()(),e.j41(9,"pre",4),e.EFF(10),e.nI1(11,"json"),e.k0s(),e.bVm()}if(2&o){const t=e.XpG();e.R7$(4),e.R50("ngModel",t.tel),e.R7$(6),e.SpI("value: ",e.bMT(11,2,t.tel),"")}}const S=a(5821).A,j=a(3140).A;let B=(()=>{class o{constructor(){this.tel=new f("","",""),this.snippets={tel:[{fileName:"app.component.ts",content:S,language:"typescript"},{fileName:"tel.component.ts",content:j,language:"typescript"}]}}static#e=this.\u0275fac=function(n){return new(n||o)};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ngs-tel-demo"]],standalone:!0,features:[e.aNF],decls:4,vars:1,consts:[["header","Telephone",3,"snippets"],[4,"ngsSnippetResult"],["required","",3,"ngModelChange","ngModel"],["matSuffix",""],["ngsHighlightContent","",1,"mt-2"]],template:function(n,r){1&n&&(e.j41(0,"h2"),e.EFF(1,"Telephone"),e.k0s(),e.j41(2,"ngs-code-snippets",0),e.DNE(3,k,12,4,"ng-container",1),e.k0s()),2&n&&(e.R7$(2),e.Y8G("snippets",r.snippets.tel))},dependencies:[l.MD,l.TG,s.YN,s.BC,s.YS,s.vS,c.RG,c.rl,c.nJ,c.MV,c.yw,h.m_,h.An,g.FC,g.Gc,E,M.j],styles:["button{background-color:#757597;padding:.25rem .5rem;border-radius:3px}"]})}return o})();var L=a(9070);const D=[{path:"",component:(()=>{class o{static#e=this.\u0275fac=function(n){return new(n||o)};static#t=this.\u0275cmp=e.VBU({type:o,selectors:[["ngs-ng-superclass-material-demo"]],standalone:!0,features:[e.aNF],decls:2,vars:0,template:function(n,r){1&n&&(e.j41(0,"ngs-demo-main-content"),e.nrm(1,"ngs-tel-demo"),e.k0s())},dependencies:[l.MD,L.V,B],changeDetection:0})}return o})()},{path:"",redirectTo:"",pathMatch:"full"}]},5821:(d,u,a)=>{a.d(u,{A:()=>l});const l="@Component({\r\n  selector: 'app-consumer',\r\n  standalone: true,\r\n  imports: [\r\n    FormsModule,\r\n    MatFormFieldModule,\r\n    MatIconModule,\r\n    MyTelInputComponent,\r\n  ],\r\n  template: `\r\n    <mat-form-field>\r\n      <mat-label>Phone number</mat-label>\r\n      <ngs-tel-input required [(ngModel)]=\"tel\"></ngs-tel-input>\r\n      <mat-icon matSuffix>phone</mat-icon>\r\n      <mat-hint>Include area code</mat-hint>\r\n    </mat-form-field>\r\n  `,\r\n})\r\nexport class AppComponent {\r\n  tel = new MyTel('', '', '');\r\n}\r\n"},3140:(d,u,a)=>{a.d(u,{A:()=>l});const l="import { Component, inject, ViewChild } from '@angular/core';\r\nimport {\r\n  AbstractControl,\r\n  FormBuilder,\r\n  ReactiveFormsModule,\r\n  Validators,\r\n} from '@angular/forms';\r\nimport { MatFormFieldControl } from '@angular/material/form-field';\r\n\r\nimport { map, Observable } from 'rxjs';\r\n\r\nimport { FormComponentMaterialSuperclass } from '../form-component-material-superclass';\r\n\r\nimport { MyTel } from './tel-input.model';\r\n\r\n@Component({\r\n  selector: 'ngs-tel-input',\r\n  standalone: true,\r\n  imports: [ReactiveFormsModule],\r\n  template: `\r\n    <div\r\n      role=\"group\"\r\n      class=\"example-tel-input-container\"\r\n      [formGroup]=\"viewModel\"\r\n      [attr.aria-labelledby]=\"formField?.getLabelId()\"\r\n    >\r\n      <input\r\n        #area\r\n        class=\"example-tel-input-element\"\r\n        formControlName=\"area\"\r\n        size=\"3\"\r\n        maxLength=\"3\"\r\n        aria-label=\"Area code\"\r\n      />\r\n      <span class=\"example-tel-input-spacer\">&ndash;</span>\r\n      <input\r\n        #exchange\r\n        class=\"example-tel-input-element\"\r\n        formControlName=\"exchange\"\r\n        maxLength=\"3\"\r\n        size=\"3\"\r\n        aria-label=\"Exchange code\"\r\n        (keyup.backspace)=\"autoFocusPrev(viewModel.controls.exchange, area)\"\r\n      />\r\n      <span class=\"example-tel-input-spacer\">&ndash;</span>\r\n      <input\r\n        #subscriber\r\n        class=\"example-tel-input-element\"\r\n        formControlName=\"subscriber\"\r\n        maxLength=\"4\"\r\n        size=\"4\"\r\n        aria-label=\"Subscriber number\"\r\n        (keyup.backspace)=\"\r\n          autoFocusPrev(viewModel.controls.subscriber, exchange)\r\n        \"\r\n      />\r\n    </div>\r\n  `,\r\n  styleUrls: ['./tel-input.scss'],\r\n  providers: [\r\n    { provide: MatFormFieldControl, useExisting: MyTelInputComponent },\r\n  ],\r\n})\r\nexport class MyTelInputComponent\r\n  extends FormComponentMaterialSuperclass<MyTel>\r\n  implements MatFormFieldControl<MyTel>\r\n{\r\n  private _formBuilder = inject(FormBuilder);\r\n\r\n  override viewModel = this._formBuilder.group({\r\n    area: [\r\n      '',\r\n      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],\r\n    ],\r\n    exchange: [\r\n      '',\r\n      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],\r\n    ],\r\n    subscriber: [\r\n      '',\r\n      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],\r\n    ],\r\n  });\r\n\r\n  @ViewChild('area') areaInput: HTMLInputElement;\r\n  @ViewChild('exchange') exchangeInput: HTMLInputElement;\r\n  @ViewChild('subscriber') subscriberInput: HTMLInputElement;\r\n\r\n  override get empty() {\r\n    const {\r\n      value: { area, exchange, subscriber },\r\n    } = this.viewModel;\r\n\r\n    return !area && !exchange && !subscriber;\r\n  }\r\n\r\n  override outerToInner = (values$: Observable<MyTel>) =>\r\n    values$.pipe(map((value) => value ?? new MyTel('', '', '')));\r\n\r\n  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {\r\n    if (control.value.length < 1) {\r\n      this.focusMonitor.focusVia(prevElement, 'program');\r\n    }\r\n  }\r\n\r\n  setDescribedByIds(ids: string[]) {\r\n    const controlElement = this.hostEl.querySelector(\r\n      '.example-tel-input-container'\r\n    );\r\n    controlElement?.setAttribute('aria-describedby', ids.join(' '));\r\n  }\r\n\r\n  onContainerClick() {\r\n    if (this.viewModel.controls.subscriber.valid) {\r\n      this.focusMonitor.focusVia(this.subscriberInput, 'program');\r\n    } else if (this.viewModel.controls.exchange.valid) {\r\n      this.focusMonitor.focusVia(this.subscriberInput, 'program');\r\n    } else if (this.viewModel.controls.area.valid) {\r\n      this.focusMonitor.focusVia(this.exchangeInput, 'program');\r\n    } else {\r\n      this.focusMonitor.focusVia(this.areaInput, 'program');\r\n    }\r\n  }\r\n}\r\n"}}]);