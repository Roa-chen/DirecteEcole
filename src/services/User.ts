import { ConnectionResponse, Discipline, Grade, Period } from "../assets/constants";
import { roundGrade } from "../assets/utils";

let instance: User | null = null;

class User {

  private username: string | undefined
  private password: string | undefined
  private token: string | undefined
  private id: string | undefined
  public schoolName: string | undefined
  public firstName: string | undefined
  public lastName: string | undefined

  public periods: Period[]



  constructor() {
    this.periods = [];
  }

  public async connect(username: string, password: string) {
    if (!(username && password)) return <ConnectionResponse>{
      sucess: false,
      username,
      password,
    };

    try {
      const response = await fetch("https://api.ecoledirecte.com/v3/login.awp?v=4.39.1", {
        method: 'POST',
        body: "data={\"identifiant\": \"arsene.chardon\",\"motdepasse\": \"larsenaldu26\",\"isReLogin\": false,\"uuid\": \"\"}",
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        }
      })

      const userinfo = await response.json()

      if (userinfo.code !== 200) return <ConnectionResponse>{
        sucess: false,
        username,
        password,
      };

      this.token = userinfo.token;

      console.log(this.token)

      
      const account = userinfo.data.accounts[0]
      
      this.id = account.id
      this.schoolName = account.nomEtablissement
      this.firstName = account.prenom
      this.lastName = account.nom
      
      console.log('registered as :', this.firstName, this.lastName)
      
      this.username = username;
      this.password = password;

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

  public async getGrades() {
    console.log("getting grades. token: ", this.token)

    const options = {
      method: 'POST',
      body: "data={}",
      headers: {
        "X-Token": this.token??'',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
      },
    }
    try {
      const response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${this.id}/notes.awp?verbe=get&v=4.39.1`, options)
      
      const gradesInfo = await response.json()

      if (gradesInfo.code !== 200) {
        console.log('error in getting grades response: ', gradesInfo)
        return false
      }

      const numberOfPeriod = gradesInfo.data.periodes.length - 1;
      const numberOfGrade = gradesInfo.data.notes.length;

      this.periods = [];

      for (let i=0; i<numberOfPeriod; i++) {

        const period = gradesInfo.data.periodes[i];
        const grades: Grade[] = [];

        for (let j=0; j<numberOfGrade; j++) {
          const grade = gradesInfo.data.notes[j];
          if (grade.codePeriode !== period.codePeriode) continue;

          grades.push({
            averageClass: Number(grade.moyenneClasse),
            codeDiscipline: grade.codeMatiere,
            codePeriod: grade.codePeriode,
            coef: Number(grade.coef),
            comment: grade.commentaire,
            date: grade.date,
            denominator: Number(grade.noteSur),
            id: grade.id,
            isPositive: grade.valeurisee,
            maxClass: Number(grade.maxClasse),
            minClass: Number(grade.minClasse),
            name: grade.devoir,
            nameDiscipline: grade.libelleMatiere,
            significant: !grade.nonSignificatif,
            typeTest: grade.typeDevoir,
            value: User.formatStringNumber(grade.valeur),
          })
        }

        this.periods.push({
          averageCalculated: User.calculateAverage(grades),
          averageClass: Number(period.ensembleMatieres.moyenneClasse),
          averageOfficial: Number(period.ensembleMatieres.moyenneGenerale),
          beginDate: period.dateDebut,
          endDate: period.dateFin,
          codePeriod: period.codePeriode,
          maxAverageClass: Number(period.moyenneMax),
          minAverageClass: Number(period.moyenneMin),
          namePeriod: period.periode,
          disciplines: period.ensembleMatieres.disciplines.map((discipline: any) => {

            const disciplineGrades = grades.filter(grade => grade.codeDiscipline === discipline.codeMatiere)

            return <Discipline>{
              averageCalculated: User.calculateAverage(disciplineGrades),
              averageClass: Number(discipline.moyenneClasse),
              averageOfficial: Number(discipline.moyenne),
              codeDiscipline: discipline.codeMatiere,
              coef: Number(discipline.coef),
              maxAverageClass: Number(discipline.moyenneMax),
              minAverageClass: Number(discipline.moyenneMin),
              nameDiscipline: discipline.discipline,
              grades: disciplineGrades,
            }
          }),
          grades: grades,
        })

        // console.log(this.periods[i])

      }


      return true
    } catch (error) {
      console.log("error while getting grades: ", error)
      return false
    }
  }

  public getToken() {
    return this.token;
  }

  private static formatStringNumber(string: string) {
    return Number(string.replaceAll(',', '.'))
  }

  private static calculateAverage(grades: Grade[]) {
    let total = 0;
    let coef = 0;

    let disciplines: {[name: string]: {
      total: number,
      coef: number,
    }} = {}

    for (let i=0; i<grades.length; i++) {
      const grade = grades[i];

      if (grade.significant) {

        if (disciplines[grade.codeDiscipline]) {
          disciplines[grade.codeDiscipline] = {
            total: disciplines[grade.codeDiscipline]?.total+((grade.value / grade.denominator)*20)*grade.coef,
            coef: disciplines[grade.codeDiscipline]?.coef+grade.coef,
          }

        } else {
          disciplines[grade.codeDiscipline] = {
            total: ((grade.value / grade.denominator)*20)*grade.coef,
            coef: grade.coef,
          }
        }
      }
    }

    for (let key of Object.keys(disciplines)) {
      total += disciplines[key].total
      coef += disciplines[key].coef
    }

    return roundGrade(total / coef);

  }

}

export function getUser() {
  if (!instance) {
    instance = new User();
  }
  return instance;
}
