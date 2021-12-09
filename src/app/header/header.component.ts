import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navItems = [
    { label: 'Home', link: '/home' },
    { label: 'Products', link: '/products' },
    { label: 'Sales', link: '/sales' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
