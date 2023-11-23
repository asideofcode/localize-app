import { updateUserData, getPlayerFromFirebase } from "./backendService";
//'Current player's account, tied with an account on Firebase.
//Since JS doesn't have singletons, care must be taken to only have one player instance!!
//Its public methods can be called to change score, XP, etc.

export class Player {
    constructor(email, username) {
      this.email = email;
      this.username = username;
      this.money = 0;
      this.xp = 0;
    }

    increaseMoney(amount) {
        getPlayerFromFirebase(this.email).then(
        //Update backend value
            updateUserData(this.email, 'money', this.money + amount)
        ).then(
            getPlayerFromFirebase(this.email) //Update currentPlayer to have up-to-date values
        );
    }

    increaseXP(amount) {
        getPlayerFromFirebase(this.email).then(
        //Update backend value
            updateUserData(this.email, 'xp', this.xp + amount)
        ).then(
            getPlayerFromFirebase(this.email) //Update currentPlayer to have up-to-date values
        );
    }
}

