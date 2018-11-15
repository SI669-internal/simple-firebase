import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';

const firebaseConfig  = {
  apiKey: "AIzaSyDijqNcYsDxLwDT9JDR1gctn1m99ZZCA4w",
  authDomain: "week10-si699-mwnewman.firebaseapp.com",
  databaseURL: "https://week10-si699-mwnewman.firebaseio.com",
  projectId: "week10-si699-mwnewman",
  storageBucket: "week10-si699-mwnewman.appspot.com",
  messagingSenderId: "304295505344"
};


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private db: any;
  private item: string = "";
  private name: string = "";
  private remoteItem: string = "";
  private remoteName: string = "";
  private foodPrefs: any[] = [];
  
  constructor(public navCtrl: NavController) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();
    let dataRef = this.db.ref('/foodPrefs');
    dataRef.on('value', snapshot => {
      console.log(snapshot);
      this.foodPrefs = []; //start with a blank list
      snapshot.forEach(childSnapshot => {
        let foodPref = {
          key: childSnapshot.key,
          name: childSnapshot.val().name,
          item: childSnapshot.val().item
        };
        console.log(foodPref);
        this.foodPrefs.push(foodPref);
      });
      // let foodPref = snapshot.val().foodPref;
      // this.remoteName = foodPref.name;
      // this.remoteItem = foodPref.item;
      // console.log("Got update: ", foodPref)
     });
  }

  private saveToFirebase() {
    let listRef = this.db.ref('/foodPrefs');
    let prefRef = listRef.push();
    let dataRecord = {
      name: this.name,
      item: this.item
    }
    prefRef.set(dataRecord);
  }
}