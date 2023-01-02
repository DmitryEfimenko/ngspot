import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RoutedTabsComponent } from './routed-tabs.component';

describe(RoutedTabsComponent.name, () => {
  let component: RoutedTabsComponent;
  let fixture: ComponentFixture<RoutedTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedTabsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
