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
import { forkJoin } from 'rxjs';
import { CacheService } from './services/cache.service';
import { HttpResponse } from '@angular/common/http';

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
  userRepos: any;
  userData: any;
  loading?: string;
  currentPage: number=1;
  perPage:number=10;
  totalPages=0;
  perPageOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  

  // Inject ApiService
  constructor(private apiService: ApiService,private cacheService: CacheService) {}

  ngOnInit() {
    // Example usage of apiService
    // this.apiService.getUser('johnpapa').subscribe(console.log);
    // this.searchGitHubAPI('johnpapa')
  }

  onPerPageChange() {
    // if (value === 'all') {
    //   this.perPage = this.userData.public_repos;
    // } else {
    //   this.perPage = +value; // Convert string to number
    // }
    this.currentPage=1;
    this.fetchPage(this.currentPage);
    console.log(this.currentPage, this.totalPages)
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
    this.currentPage=1;
    this.totalPages=0;
    this.userData=[];
    this.userRepos=[];
    this.loading='';
    // this.searchGitHubAPI(searchTerm);
    const cachedUserData = this.cacheService.getUserData(searchTerm);

    if (cachedUserData) {
      this.userData = cachedUserData;
      this.loading='Loading Repos...'
      const cachedUserRepos = this.cacheService.getUserRepos(`${searchTerm}+${this.currentPage}+${this.totalPages}`);
      if (cachedUserRepos) {
        this.userRepos = cachedUserRepos;
        this.loading='';
      } else {
        this.fetchPage(1);
      }
    } else {
      this.fetchUserData(searchTerm);
    }
  }
  

  fetchUserData(username: string) {
    this.apiService.getUser(username).subscribe(userData => {
      this.userData = userData;
      console.log(this.userData)
      this.totalPages=Math.ceil(this.userData.public_repos/this.perPage);
      this.cacheService.setUserData(username, userData);
      this.loading='Loading Repos...';
      this.fetchPage(1);
    });
  }


  fetchPage = (page: number) => {
    this.loading='Loading Repos...'
    this.userRepos=[];
    console.log(this.perPage)
      this.totalPages=Math.ceil(this.userData.public_repos/this.perPage);
    const userRepos=this.cacheService.getUserRepos(`${this.userData.login}+${this.currentPage}+${this.totalPages}`);
    if(!userRepos){
      this.apiService.getRepos(this.userData.repos_url, page, this.perPage ).subscribe((response: HttpResponse<any>) => {
      const userRepos = response.body;
        // console.log(response)
        console.log(userRepos)
        // allRepos = allRepos.concat(userRepos);
        // console.log(allRepos)
        const nextPageLink = this.apiService.getNextPageLink(response); // Example function to get next page link from headers
        console.log(nextPageLink);
        
        this.userRepos = userRepos;
        this.userRepos.forEach((repo:any)=>{
          this.limitTopics(repo);
        })
        this.loading='';
        this.cacheService.setUserRepos(`${this.userData.login}+${page}+${this.totalPages}`, userRepos);
      });
    }
    else{
      this.userRepos=userRepos;
      this.loading='';
    }
  };

  limitTopics(repo:any){
    const maxTopics=4;
    const remainingTopics=repo.topics.length - maxTopics;
    if(remainingTopics>0){
      const tempValue=repo.topics[3];
      repo.topics=repo.topics.slice(0,maxTopics-1);
      repo.topics.push(`${tempValue} ${remainingTopics+1}+`);

    }
  }

  previousPage(){
    if(this.currentPage>1){
      this.currentPage--;
      this.fetchPage(this.currentPage);
    }
  }

  nextPage(){
    if(this.currentPage<this.totalPages){
      this.currentPage++;
      this.fetchPage(this.currentPage);
    }
  }

  searchGitHubAPI(searchTerm: string) {
     }
  
}
