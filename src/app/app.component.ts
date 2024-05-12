// import { Component, OnInit } from '@angular/core';
// import { ApiService } from './services/api.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })

// export interface SearchForm{
//   searchTerm:string;
// }
// export class AppComponent implements OnInit{
//   constructor(
//     private apiService: ApiService
//   ) {}

//   ngOnInit() {
//     this.apiService.getUser('johnpapa').subscribe(console.log);
//   }

//   scaleButton() {
//     const button = document.querySelector('button');
//     if (button) {
//       button.classList.add('scale-95');
//       setTimeout(() => {
//         button.classList.remove('scale-95');
//       }, 300); // Duration of the transition in milliseconds
//     }
//   }

//   onSubmit(formValue: searchForm) {
//     // Handle form submission
//     const searchTerm = formValue.searchTerm;
//     this.searchGitHubAPI(searchTerm);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

// Define SearchForm interface
export interface SearchForm {
  searchTerm: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userData: any;

  // Inject ApiService
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Example usage of apiService
    this.apiService.getUser('johnpapa').subscribe(console.log);
  }

  // Function to add scaling effect
  scaleButton() {
    const button = document.querySelector('button');
    if (button) {
      button.classList.add('scale-95');
      setTimeout(() => {
        button.classList.remove('scale-95');
      }, 300); // Duration of the transition in milliseconds
    }
  }

  // Function to handle form submission
  onSubmit(formValue: SearchForm) {
    // Handle form submission
    const searchTerm = formValue.searchTerm;
    this.searchGitHubAPI(searchTerm);
  }

  // Function to make GET request to GitHub API
  searchGitHubAPI(searchTerm: string) {
    const url = `https://api.github.com/search/repositories?q=${searchTerm}`;
    this.apiService.getUser(searchTerm).subscribe(response=>{
      this.userData=response;
      console.log(this.userData)
      this.apiService.getRepos(this.userData.repos_url).subscribe(response=>{
        console.log(response)
      })
    })
    // Example usage of HttpClient to make GET request
    // this.apiService.get(url).subscribe(response => {
    //   console.log(response);
    //   // Process the response data as needed
    // });
  }
}
