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

  constructor(public navCtrl: NavController) {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();
    // this.appDataRef.on('value', snapshot => {
    //   console.log(snapshot.toJSON());
    // });

  }
  private saveToFirebase() {
    let dataRef = this.db.ref('/');
    dataRef.set({itemKey: this.item});
  }


}