import { FetchingResponse, Discipline, Grade, UserInfo } from "../assets/constants";
import { calculateAverage, formatStringNumber } from "../assets/utils";

export const logIn_ = async (username: string, password: string) => {

  if (!(username && password)) return <FetchingResponse>{
    success: false,
    username,
    password,
    message: 'Identifiant ou mot de passe non renseigné.'
  };

  const user: UserInfo = {
    childs: [],
    username,
    password,
  }

  try {
    const response = await fetch("https://api.ecoledirecte.com/v3/login.awp?v=4.39.1", {
      method: 'POST',
      body: `data={\"identifiant\": \"${username}\",\"motdepasse\": \"${password}\",\"isReLogin\": false,\"uuid\": \"\"}`,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
      }
    })

    const userinfo = await response.json()

    if (userinfo.code !== 200) return <FetchingResponse>{
      success: false,
      username,
      password,
      message: 'Identifiant et/ou mot de passe invalide.'
    };

    user.token = userinfo.token;

    const account = userinfo.data.accounts[0];

    user.id = account.id;
    user.schoolName = account.nomEtablissement;
    user.firstName = account.prenom;
    user.lastName = account.nom;
    user.typeAccount = account.typeCompte;

    user.childs = [];

    if (user.typeAccount === "1") {
      for (let i = 0; i < account.profile.eleves.length; i++) {
        const child = account.profile.eleves[i]

        user.childs.push({
          firstName: child.prenom,
          lastName: child.nom,
          id: child.id,
        })
      }

    }

    console.log('registered as :', user.firstName, user.lastName)

    user.connected = true;

    const promise: FetchingResponse = {
      success: true,
      data: user,
    }

    return promise;

  } catch (err) {
    console.log('error while connecting: ', err)

    const promise: FetchingResponse = {
      success: false,
      message: 'Vérifiez votre connection et réessayez.',
    }

    return promise;
  }
}

export const fetchGrades_ = async (token: string | undefined, id: string | undefined) => {

  if (!token || !id) {
    console.log('Need a token and an id') //FIXME
    return <FetchingResponse>{
      success: false,
      message: 'Error while getting grades, token or id were not gave.' ,
    }
  }

  console.log("getting grades with token: ", token)

  const user: UserInfo = {}

  const options = {
    method: 'POST',
    body: "data={}",
    headers: {
      "X-Token": token ?? '',
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
    },
  }
  try {
    const response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${id}/notes.awp?verbe=get&v=4.39.1`, options)

    const gradesInfo = await response.json()

    if (gradesInfo.code !== 200) {
      console.log('error in getting grades response: ', gradesInfo)
      return <FetchingResponse>{success: false}
    }

    user.numberOfPeriod = gradesInfo.data.periodes.length - 1;
    const numberOfGrade = gradesInfo.data.notes.length;

    user.periods = [];
    user.grades = {};

    for (let i = 0; i < user.numberOfPeriod; i++) {

      const period = gradesInfo.data.periodes[i];
      const periodGrades: Grade[] = [];

      for (let j = 0; j < numberOfGrade; j++) {
        const grade = gradesInfo.data.notes[j];
        if (grade.codePeriode !== period.codePeriode) continue;

        user.grades[grade.id.toString()] = {
          averageClass: Number(grade.moyenneClasse),
          codeDiscipline: grade.codeMatiere,
          codePeriod: grade.codePeriode,
          coef: Number(grade.coef),
          comment: grade.commentaire,
          date: grade.date,
          displayDate: grade.dateSaisie,
          denominator: Number(grade.noteSur),
          id: grade.id.toString(),
          isPositive: grade.valeurisee,
          maxClass: Number(grade.maxClasse),
          minClass: Number(grade.minClasse),
          name: grade.devoir,
          nameDiscipline: grade.libelleMatiere,
          significant: !grade.nonSignificatif,
          typeTest: grade.typeDevoir,
          value: formatStringNumber(grade.valeur),
          codeValue: grade.valeur.toString(),
        }

        periodGrades.push(user.grades[grade.id.toString()])
      }

      user.periods?.push({
        averageCalculated: calculateAverage(periodGrades),
        averageClass: formatStringNumber(period.ensembleMatieres.moyenneClasse),
        averageOfficial: formatStringNumber(period.ensembleMatieres.moyenneGenerale),
        beginDate: Date.parse(period.dateDebut),
        endDate: Date.parse(period.dateFin),
        codePeriod: period.codePeriode,
        maxAverageClass: formatStringNumber(period.moyenneMax),
        minAverageClass: formatStringNumber(period.moyenneMin),
        namePeriod: period.periode,
        disciplines: period.ensembleMatieres.disciplines.map((discipline: any) => {

          const disciplineGrades = Object.values(user.grades ?? {}).filter(grade => grade.codeDiscipline === discipline.codeMatiere && grade.codePeriod === period.codePeriode)
          
          const newDiscipline: Discipline = {
            averageCalculated: calculateAverage(disciplineGrades),
            averageClass: formatStringNumber(discipline.moyenneClasse),
            averageOfficial: formatStringNumber(discipline.moyenne),
            codeDiscipline: discipline.codeMatiere,
            coef: formatStringNumber(discipline.coef),
            maxAverageClass: formatStringNumber(discipline.moyenneMax),
            minAverageClass: formatStringNumber(discipline.moyenneMin),
            nameDiscipline: discipline.discipline,
            grades: disciplineGrades,
          }

          return newDiscipline;
        }),
        grades: periodGrades,

      })
    }

    const promise: FetchingResponse = {
      success: true,
      data: user,
    }

    return promise
  } catch (error) {
    console.log("error while getting grades: ", error)
    return <FetchingResponse>{success: false}
  }
}