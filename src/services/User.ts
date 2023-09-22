import { ConnectionResponse } from "../assets/constants";

let instance: User | null = null;

class User {

  private username: string | undefined
  private password: string | undefined
  private token: string | undefined
  private id: string | undefined
  public schoolName: string | undefined
  public firstName: string | undefined
  public lastName: string | undefined

  constructor() {
    this.id = "1594"; //FIXME set from connect method
  }

  public async connect(username: string, password: string) {
    if (!(username && password)) return <ConnectionResponse>{
      sucess: false,
      username,
      password,
    };;

    try {
      const response = await fetch("https://api.ecoledirecte.com/v3/login.awp?v=4.33.0", {
        method: 'POST',
        body: "data={\"identifiant\": \"arsene.chardon\",\"motdepasse\": \"larsenaldu26\",\"isReLogin\": false,\"uuid\": \"\"}",
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        }
      })

      const userinfo = await response.json()

      console.log(userinfo.data.accounts)

      this.token = userinfo.token;

      const account = userinfo.data.accounts[0]

      this.id = account.id
      this.schoolName = account.nomEtablissement
      this.firstName = account.prenom
      this.lastName = account.nom

      console.log('registered as :', userinfo.username, userinfo.password)
      console.log('userinfo: ', userinfo)

      return <ConnectionResponse>{
        sucess: true,
        username,
        password,
      };
    } catch (err) {
      console.log('error while connecting: ', err)
      return <ConnectionResponse>{
        sucess: false,
        username,
        password,
      };
    }
  }

  public async getGrades(token: string) {
    console.log("getting grades")

    const options = {
      method: 'POST',
      body: "data={}",
      headers: {
        "X-Token": token
      }
    }
    try {
      const response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${this.id}/notes.awp?verbe=get&v=4.33.0`, options)
      const gradesInfo = await response.json()
    } catch (error) {
      console.log("error while getting grades: ", error)
    }
  }

  public getToken() {
    return this.token;
  }

}

export function getUser() {
  if (!instance) {
    instance = new User();
  }
  return instance;
}
