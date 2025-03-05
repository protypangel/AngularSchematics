import { TestBed } from '@angular/core/testing';
import { provideRouter, withRouterConfig, Router } from '@angular/router';
import { Location } from '@angular/common';
import { <%= classify(folderName) %>Route<% ImportInterface %> } from './<%= dasherize(folderName) %>';

describe('<%= classify(folderName) %>Route', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [<%= classify(folderName) %>Route],
            providers: [
                provideRouter([
                    { path: '<%= url %>', component: <%= classify(folderName) %>Route }
                ], withRouterConfig({
                    onSameUrlNavigation: 'reload'
                }))
            ]
        }).compileComponents();
    });
    it('should create the app', () => {
        const fixture = TestBed.createComponent(<%= classify(folderName) %>Route);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
    it('should navigate to test route', () => {
        const fixture = TestBed.createComponent(<%= classify(folderName) %>Route);
        const router = TestBed.inject(Router);
        const location = TestBed.inject(Location);
        const component = fixture.componentInstance;

        router.navigate(['/test']);
        fixture.detectChanges();

        expect(location.path()).toBe('/test');
    });
});