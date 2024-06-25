import { signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
export class Auth {
  constructor(provider) {
    this.provider = provider;
  }
  async handlePopUpProvider() {
    return await signInWithPopup(auth, this.provider);
  }
}
