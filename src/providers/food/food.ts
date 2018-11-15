import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

const firebaseConfig  = {
  apiKey: "AIzaSyDijqNcYsDxLwDT9JDR1gctn1m99ZZCA4w",
  authDomain: "week10-si699-mwnewman.firebaseapp.com",
  databaseURL: "https://week10-si699-mwnewman.firebaseio.com",
  projectId: "week10-si699-mwnewman",
  storageBucket: "week10-si699-mwnewman.appspot.com",
  messagingSenderId: "304295505344"
};


@Injectable()
export class FoodProvider {

  private db: any;
  private foodPrefs: any[] = [];
  private serviceObserver: Observer<any[]>;
  private clientObservable: Observable<any[]>;
  private nextID: number = 0;

  constructor(private storage: Storage ) { 
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();

    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    });

    // this.storage.get("myFoodPrefs").then(data => {
    //   if (data != undefined && data != null) {
    //     this.foodPrefs = JSON.parse(data);
    //     this.notifySubscribers();
    //   }
    // }, err => {
    //   console.log(err);
    // });

    // this.storage.get("nextID").then(data => {
    //   if (data != undefined && data != null) {
    //     this.nextID = JSON.parse(data);
    //   }
    // }, err => {
    //   console.log(err);
    // });

    let dataRef = this.db.ref('/foodPrefs');
    dataRef.on('value', snapshot => {
      this.foodPrefs = []; //start with a blank list
      snapshot.forEach(childSnapshot => {
        let foodPref = {
          key: childSnapshot.key,
          name: childSnapshot.val().name,
          item: childSnapshot.val().item
        };
        this.foodPrefs.push(foodPref);
      });
      this.notifySubscribers();
    });
    
  }

  public getObservable(): Observable<any[]> {
    return this.clientObservable;
  }

  private notifySubscribers(): void {
    this.serviceObserver.next(undefined);
  }

  public getFoodPrefs():any[] {
    let entriesClone = JSON.parse(JSON.stringify(this.foodPrefs));
    console.log("Someone got my entries! They got: ", entriesClone);
    return entriesClone;
  }

  public addFoodPref(pref:any) {
    let listRef = this.db.ref('/foodPrefs');
    let prefRef = listRef.push();
    let dataRecord = {
      name: pref.name,
      item: pref.item
    }
    prefRef.set(dataRecord);
  }

  private getUniqueID(): number {
    let uniqueID = this.nextID++;
    this.storage.set("nextID", this.nextID);
    return uniqueID;
  }

  public getFoodPrefByID(id: number): any {
    for (let e of this.foodPrefs) {
      if (e.id === id) {
        let clone = JSON.parse(JSON.stringify(e));
        return clone;
      }
    }
    return undefined;
  }

  public updateFoodPref(id: number, newPref: any): void {
    let prefToUpdate: any = this.findEntryByID(id); 
    prefToUpdate.title = newPref.title;
    prefToUpdate.text = newPref.text;
    prefToUpdate.timestamp = newPref.timestamp;
    this.notifySubscribers();
    this.saveData();
  }

  public removeFoodPref(id: number): void {
    for (let i = 0; i < this.foodPrefs.length; i++) {
      let iID = this.foodPrefs[i].id;
      if (iID === id) {
        this.foodPrefs.splice(i, 1);
        break;
      }
    }
    this.notifySubscribers();
    this.saveData();
  }

  private findEntryByID(id: number): any {
    for (let e of this.foodPrefs) {
      if (e.id === id) {
         return e;
      }
    }
    return undefined;
  }

  private saveData(): void {
    let key = "myFoodPrefs";
    this.storage.set(key, JSON.stringify(this.foodPrefs));
  }

}
