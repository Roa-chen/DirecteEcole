import { Alert } from "react-native";
import { ConnectionResponse, Discipline, Grade, Period } from "../assets/constants";
import { roundGrade } from "../assets/utils";

let instance: User | null = null;

class User {

  public connected: boolean
  public username: string | undefined
  public password: string | undefined
  private token: string | undefined
  private id: string | undefined
  public schoolName: string | undefined
  public firstName: string | undefined
  public lastName: string | undefined
  public typeAccount: string | undefined

  public childs: {
    id: number;
    firstName: string | undefined;
    lastName: string | undefined;
  }[]
  public selectedChild = 0;

  public numberOfPeriod: number | undefined;
  public periods: Period[]
  public grades: { [id: string]: Grade }

  private subscriptions: (() => void)[]


  constructor() {
    this.periods = [];
    this.grades = {};
    this.subscriptions = [];
    this.childs = [{ "firstName": "Arsène", "id": 1594, "lastName": "CHARDON" }, { "firstName": "Arsène", "id": 1594, "lastName": "CHARDON" }];
    // this.childs = [];
    this.connected = false;
  }

  public async connect(username: string, password: string) {
    if (!(username && password)) return <ConnectionResponse>{
      success: false,
      username,
      password,
      message: 'Identifiant ou mot de passe non renseigné.'
    };

    try {
      const response = await fetch("https://api.ecoledirecte.com/v3/login.awp?v=4.39.1", {
        method: 'POST',
        body: `data={\"identifiant\": \"${username}\",\"motdepasse\": \"${password}\",\"isReLogin\": false,\"uuid\": \"\"}`,
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        }
      })

      const userinfo = await response.json()

      if (userinfo.code !== 200) return <ConnectionResponse>{
        success: false,
        username,
        password,
        message: 'Identifiant et/ou mot de passe invalide.'
      };

      this.token = userinfo.token;

      const account = userinfo.data.accounts[0];

      this.id = account.id;
      this.schoolName = account.nomEtablissement;
      this.firstName = account.prenom;
      this.lastName = account.nom;
      this.typeAccount = account.typeCompte;

      if (this.typeAccount === "1") {
        for (let i = 0; i < account.profile.eleves.length; i++) {
          const child = account.profile.eleves[i]

          this.childs.push({
            firstName: child.prenom,
            lastName: child.nom,
            id: child.id,
          })
        }

        console.log(this.childs)
      }

      console.log('registered as :', this.firstName, this.lastName)

      this.username = username;
      this.password = password;
      this.connected = true;

      return <ConnectionResponse>{
        success: true,
        username,
        password,
      };
    } catch (err) {
      console.log('error while connecting: ', err)
      return <ConnectionResponse>{
        success: false,
        username,
        password,
        message: 'Vérifiez votre connection et réessayez.'
      };
    }
  }

  public async getGrades() {

    if (!this.token) {
      const response = await this.connect(this.username ?? '', this.password ?? '');

      if (!response.success) {
        Alert.alert('Erreur:', response.message)
        return false
      }
    }

    console.log("getting grades: token: ", this.token)

    const options = {
      method: 'POST',
      body: "data={}",
      headers: {
        "X-Token": this.token ?? '',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
      },
    }
    try {
      const response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${this.getId()}/notes.awp?verbe=get&v=4.39.1`, options)

      const gradesInfo = await response.json()

      if (gradesInfo.code !== 200) {
        console.log('error in getting grades response: ', gradesInfo)
        return false
      }

      this.numberOfPeriod = gradesInfo.data.periodes.length - 1;
      const numberOfGrade = gradesInfo.data.notes.length;

      this.periods = [];
      this.grades = {};

      for (let i = 0; i < this.numberOfPeriod; i++) {

        const period = gradesInfo.data.periodes[i];
        const periodGradeIds = [];

        for (let j = 0; j < numberOfGrade; j++) {
          const grade = gradesInfo.data.notes[j];
          if (grade.codePeriode !== period.codePeriode) continue;

          this.grades[grade.id.toString()] = {
            averageClass: Number(grade.moyenneClasse),
            codeDiscipline: grade.codeMatiere,
            codePeriod: grade.codePeriode,
            coef: Number(grade.coef),
            comment: grade.commentaire,
            date: grade.date,
            denominator: Number(grade.noteSur),
            id: grade.id.toString(),
            isPositive: grade.valeurisee,
            maxClass: Number(grade.maxClasse),
            minClass: Number(grade.minClasse),
            name: grade.devoir,
            nameDiscipline: grade.libelleMatiere,
            significant: !grade.nonSignificatif,
            typeTest: grade.typeDevoir,
            value: User.formatStringNumber(grade.valeur),
            codeValue: grade.valeur.toString(),
          }

          periodGradeIds.push(grade.id.toString())
        }

        this.periods.push({
          averageCalculated: this.calculateAverage(periodGradeIds),
          averageClass: User.formatStringNumber(period.ensembleMatieres.moyenneClasse),
          averageOfficial: User.formatStringNumber(period.ensembleMatieres.moyenneGenerale),
          beginDate: Date.parse(period.dateDebut),
          endDate: Date.parse(period.dateFin),
          codePeriod: period.codePeriode,
          maxAverageClass: User.formatStringNumber(period.moyenneMax),
          minAverageClass: User.formatStringNumber(period.moyenneMin),
          namePeriod: period.periode,
          disciplines: period.ensembleMatieres.disciplines.map((discipline: any) => {

            const disciplineGradeIds = Object.values(this.grades).filter(grade => grade.codeDiscipline === discipline.codeMatiere && grade.codePeriod === period.codePeriode).map(grade => grade.id)

            return <Discipline>{
              averageCalculated: this.calculateAverage(disciplineGradeIds),
              averageClass: User.formatStringNumber(discipline.moyenneClasse),
              averageOfficial: User.formatStringNumber(discipline.moyenne),
              codeDiscipline: discipline.codeMatiere,
              coef: User.formatStringNumber(discipline.coef),
              maxAverageClass: User.formatStringNumber(discipline.moyenneMax),
              minAverageClass: User.formatStringNumber(discipline.moyenneMin),
              nameDiscipline: discipline.discipline,
              gradeIds: disciplineGradeIds,
            }
          }),
          gradeIds: periodGradeIds,
        })
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
    if (!string) return Number(string)
    if (typeof string === "number") return string
    return Number(string.replaceAll(',', '.'))
  }

  private calculateAverage(gradeIds: string[]) {
    let total = 0;
    let coef = 0;

    let disciplines: {
      [name: string]: {
        total: number,
        coef: number,
      }
    } = {}

    for (let i = 0; i < gradeIds.length; i++) {
      const grade = this.grades[gradeIds[i]];

      if (grade.significant) {

        if (disciplines[grade.codeDiscipline]) {
          disciplines[grade.codeDiscipline] = {
            total: disciplines[grade.codeDiscipline]?.total + ((grade.value / grade.denominator) * 20) * grade.coef,
            coef: disciplines[grade.codeDiscipline]?.coef + grade.coef,
          }

        } else {
          disciplines[grade.codeDiscipline] = {
            total: ((grade.value / grade.denominator) * 20) * grade.coef,
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

  public refreshAverage() {
    for (let periodIndex = 0; periodIndex < this.periods.length; periodIndex++) {
      const period = this.periods[periodIndex]
      const grades = period.gradeIds;

      period.averageCalculated = this.calculateAverage(grades);

      for (let disciplineIndex = 0; disciplineIndex < period.disciplines.length; disciplineIndex++) {
        const discipline = period.disciplines[disciplineIndex];
        discipline.averageCalculated = this.calculateAverage(discipline.gradeIds);
      }
    }

  }

  public setSignificant(gradeId: string, significant: boolean) {
    this.grades[gradeId].significant = significant;
    this.refreshAverage()
    this.notify()
  }

  public subscribe(onChange: () => void) {
    this.subscriptions.push(onChange)
  }

  private notify() {
    this.subscriptions.forEach(onChange => onChange())
  }

  private getId() {
    if (this.typeAccount === "1") {
      return this.childs[this.selectedChild].id
    }
    return this.id;
  }

  public setCredentials(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public getCurrentPeriod() {
    const now = Date.now();
    for (let i = 0; i < (this.numberOfPeriod ?? 0); i++) {
      const period = this.periods[i];
      if (period.beginDate <= now && now <= period.endDate) return i;
    }
    return -1;
  }

  public changeChild(index: number) {
    if (this.typeAccount === '1' && index >= 0 && index < this.childs.length) {
      if (this.selectedChild !== index) {
        this.selectedChild = index

        this.numberOfPeriod = undefined
        this.periods = [];
        this.grades = {};

        this.notify();

        this.getGrades().then((success) => {
          if (success) {
            this.notify()
          }
        })
      }
    }
  }
}

export function getUser() {
  if (!instance) {
    instance = new User();
  }
  return instance;
}

export function clearUser() {
  instance = null;
} 