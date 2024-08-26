import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import { environment } from '../environment.prod';

const headers=new HttpHeaders({
  'Authorization': `Bearer ${environment.token}`
})
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`, {headers});
    // const result=this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
    // return result;
  }

  getRepos(githubRepo: string, page:number=1, perPage:number=30){
    const params=new HttpParams().set('page', page.toString()).set('per_page',perPage.toString());
    return this.httpClient.get(githubRepo, {headers, params, observe: 'response'});
  }

  getNextPageLink(response: HttpResponse<any>): string | null {
    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      return null;
    }
    console.log(JSON.stringify(linkHeader));
    
    const links = linkHeader.split(', ');
    for (const link of links) {
      const [url, rel] = link.split('; ');
      if (rel.includes('next')) {
        return url.slice(1, -1); // Remove angle brackets from URL
      }
    }
    
    return null;
  }

  getPageNumberFromLink(link: string): number {
    const match = link.match(/page=(\d+)/);
    if (match && match.length > 1) {
      return parseInt(match[1], 10);
    }
    return 1; // Default to page 1 if page number is not found in the link
  }



  // implement getRepos method by referring to the documentation. Add proper types for the return type and params 
  getReposTags(topicUrl: string){
    return this.httpClient.get(topicUrl, {headers});
  }

}
