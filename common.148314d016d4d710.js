"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[76],{5791:(E,b,a)=>{a.d(b,{Hy:()=>U,Kt:()=>l,pQ:()=>m});var t=a(4438);let l=(()=>{class n{constructor(s){this.templateRef=s}static#t=this.\u0275fac=function(e){return new(e||n)(t.rXU(t.C4Q))};static#s=this.\u0275dir=t.FsC({type:n,selectors:[["","ngsRoutedTab",""]],inputs:{routeName:[t.Mj6.None,"ngsRoutedTab","routeName"],label:[t.Mj6.None,"ngsRoutedTabLabel","label"]},standalone:!0})}return n})();var h=a(177),u=a(6850),f=a(1443),d=a(8359),v=a(9172),T=a(6354),R=a(8141),c=a(33),k=a(5964),F=a(5245);let y=(()=>{class n{constructor(){this.subscriptions=new d.yU,this.navigationFocusRequests=[],this.skipLinkFocusRequests=[],this.router=(0,t.WQX)(c.Ix),this.navigationEndEvents=this.router.events.pipe((0,k.p)(s=>s instanceof c.wF)),this.softNavigations=this.navigationEndEvents.pipe((0,F.i)(1)),this.subscriptions.add(this.softNavigations.subscribe(()=>{this.router.url.split("#")[1]||setTimeout(()=>{this.navigationFocusRequests.length&&this.navigationFocusRequests[this.navigationFocusRequests.length-1].focus({preventScroll:!0})},100)}))}ngOnDestroy(){this.subscriptions.unsubscribe()}requestFocusOnNavigation(s){this.navigationFocusRequests.push(s)}relinquishFocusOnNavigation(s){this.navigationFocusRequests.splice(this.navigationFocusRequests.indexOf(s),1)}requestSkipLinkFocus(s){this.skipLinkFocusRequests.push(s),this.setSkipLinkHref(s)}relinquishSkipLinkFocus(s){this.skipLinkFocusRequests.splice(this.skipLinkFocusRequests.indexOf(s),1),this.setSkipLinkHref(this.skipLinkFocusRequests[this.skipLinkFocusRequests.length-1])}setSkipLinkHref(s){const e=this.router.url.split("#")[0];this.skipLinkHref=s?`${e}#${s.id}`:null}getSkipLinkHref(){return this.skipLinkHref}isNavigationWithinComponentView(s,e){const o=/(components|cdk)\/([^/]+)/,i=s.match(o),r=e.match(o);return s&&e&&i&&r&&i[0]===r[0]&&i[1]===r[1]}static#t=this.\u0275fac=function(e){return new(e||n)};static#s=this.\u0275prov=t.jDH({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})();var N=a(7428);function C(n,g){1&n&&t.eu8(0)}function L(n,g){if(1&n&&t.DNE(0,C,1,0,"ng-container",4),2&n){const s=t.XpG().$implicit;t.Y8G("ngTemplateOutlet",s.templateRef)}}function S(n,g){if(1&n&&(t.qex(0),t.j41(1,"mat-tab",2),t.DNE(2,L,1,1,"ng-template",3),t.k0s(),t.bVm()),2&n){const s=g.$implicit;t.R7$(),t.Y8G("label",s.label)}}const p="section",U=`:${p}`;let m=(()=>{class n{constructor(s,e,o,i){this.navigationFocusService=s,this.router=e,this.activatedRoute=o,this.ga=i,this.subs=new d.yU,this.isFirstSync=!0}ngAfterViewInit(){this.syncRouteWithTabs()}ngOnDestroy(){this.subs.unsubscribe()}updateUrl(s){const e=this.routedTabs.get(s)?.routeName,o=this.activatedRoute.snapshot.paramMap.get(p);if(e&&e!==o){const i=this.router.createUrlTree([e],{relativeTo:this.activatedRoute.parent}).toString();this.router.navigateByUrl(i)}}trackByRouteName(s,e){return e.routeName}syncRouteWithTabs(){const s=this.navigationFocusService.navigationEndEvents.pipe((0,v.Z)(null),(0,T.T)(()=>this.activatedRoute.snapshot.paramMap.get(p)),(0,f.w)(),(0,R.M)(e=>{let o=-1;for(let i=0;i<this.routedTabs.length;i++)if(this.routedTabs.get(i)?.routeName===e){o=i;break}if(o>-1){this.tabs.selectedIndex=o;const i=this.routedTabs.get(o)?.label;i&&this.ga.event("routed_tab_click","navigation",i),setTimeout(()=>{this.isFirstSync=!1},500)}}));this.subs.add(s.subscribe())}static#t=this.\u0275fac=function(e){return new(e||n)(t.rXU(y),t.rXU(c.Ix),t.rXU(c.nX),t.rXU(N.p))};static#s=this.\u0275cmp=t.VBU({type:n,selectors:[["ngs-routed-tabs"]],contentQueries:function(e,o,i){if(1&e&&t.wni(i,l,4),2&e){let r;t.mGM(r=t.lsd())&&(o.routedTabs=r)}},viewQuery:function(e,o){if(1&e&&t.GBs(u.T8,7),2&e){let i;t.mGM(i=t.lsd())&&(o.tabs=i.first)}},standalone:!0,features:[t.aNF],decls:2,vars:3,consts:[["mat-stretch-tabs","false","mat-align-tabs","center",1,"sections",3,"selectedIndexChange","animationDuration"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"label"],["matTabContent",""],[4,"ngTemplateOutlet"]],template:function(e,o){1&e&&(t.j41(0,"mat-tab-group",0),t.bIt("selectedIndexChange",function(r){return o.updateUrl(r)}),t.DNE(1,S,3,1,"ng-container",1),t.k0s()),2&e&&(t.Y8G("animationDuration",o.isFirstSync?0:500),t.R7$(),t.Y8G("ngForOf",o.routedTabs)("ngForTrackBy",o.trackByRouteName))},dependencies:[h.MD,h.Sq,h.T3,u.RI,u.$L,u.mq,u.T8],styles:["mat-tab-group.sections>mat-tab-header{position:sticky!important;top:0;z-index:10}"],changeDetection:0})}return n})()}}]);