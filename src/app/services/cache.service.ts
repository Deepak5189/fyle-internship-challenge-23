import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cachedUserData: any = {};
  private cachedUserRepos: any = {};

  getUserData(username: string): any {
    return this.cachedUserData[username];
  }

  setUserData(username: string, data: any): void {
    this.cachedUserData[username] = data;
  }

  getUserRepos(searchTerm: string, ): any {
    return this.cachedUserRepos[searchTerm];
  }

  setUserRepos(searchTerm: string, data: any): void {
    this.cachedUserRepos[searchTerm] = data;
  }
}
