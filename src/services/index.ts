import { FetchingResponse, Discipline, Grade, UserInfo, QuestionsResponse } from "../assets/constants";
import { calculateAverage, formatStringNumber, useAppDispatch } from "../assets/utils";
import { Buffer } from "buffer";

const useRealData = !__DEV__ || true;
const unrealUsername = "developer.developer";
const unrealPassword = "playConsole";

const apiVersion = "4.54.2"; //4.39.1


export const getQuestions = async (username: string, password: string) => {
  if (!(username && password)) return <QuestionsResponse>{
    success: false,
    username,
    password,
    message: 'Identifiant ou mot de passe non renseigné.'
  };

  try {
    let tokenInfo;
    let token;
    let doubleAuthData;

    if (!useRealData || (username == unrealUsername && password == unrealPassword)) { // TODO handle developer session
      tokenInfo = require('../assets/login.json');
    } else {


      const longinResponse = await fetch(`https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, {
        method: 'POST',
        body: `data={\"identifiant\": \"${username}\",\"motdepasse\": \"${password}\",\"isReLogin\": false,\"uuid\": \"\", \"fa\": []}`,
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        }
      })
      const tokenInfo = await longinResponse.json()

      token = tokenInfo.token;

      const doubleAuthResponse = await fetch("https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&v=4.54.2", {
        "headers": {
          "x-token": token,
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        },
        "body": "data={}",
        "method": "POST"
      });

      doubleAuthData = await doubleAuthResponse.json();
    }

    const promise: QuestionsResponse = {
      success: true,
      token,
      data: {
        question: Buffer.from(doubleAuthData.data.question, 'base64').toString('utf-8'),
        responsesB64: doubleAuthData.data.propositions,
        responses:doubleAuthData.data.propositions.map((encodedResponse: string) => Buffer.from(encodedResponse, 'base64').toString('utf-8')),
      },
    }

    return promise;

  } catch (err) {
    console.log('error while connecting: ', err)

    const promise: QuestionsResponse = {
      success: false,
      message: 'Vérifiez votre connection et réessayez.',
    }

    return promise;
  }
}

export const reLogIn_ = async (username: string, password: string, cn: string, cv: string) => {





}

export const logIn_ = async (username: string, password: string, response?: string, token?: string, cn?: string, cv?: string) => {

  console.log('data : ', username, password, response, token, cn, cv);


  if (!(username && password && ((response && token) || (cn && cv)))) return <FetchingResponse>{
    success: false,
    username,
    password,
    message: !(username && password) ? 'Identifiant ou mot de passe non renseigné.' : 'Veuillez selectionner une réponse.'
  };

  const user: UserInfo = {
    childs: [],
    username,
    password,
  }

  try {
    let userinfo;

    if (!useRealData || (username == unrealUsername && password == unrealPassword)) {
      userinfo = require('../assets/login.json');

    } else {


      if (!(cn && cv) && token) {

        const doubleAuthResponseWithInfo = await fetch("https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=4.54.2", {
          "headers": {
            "x-token": token,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
          },
          "body": `data={\"choix\": \"${response}\"}`,
          "method": "POST"
        });

        const doubleAuthInfo = await doubleAuthResponseWithInfo.json();

        if (doubleAuthInfo.code !== 200) {
          return <FetchingResponse>{
            success: false,
            username,
            password,
            message: 'Réponse incorrecte'
          };
        }

        cn = doubleAuthInfo.data.cn;
        cv = doubleAuthInfo.data.cv;
      }


      const finalResponse = await fetch(`https://api.ecoledirecte.com/v3/login.awp?v=${apiVersion}`, {
        method: 'POST',
        body: `data={
            \"identifiant\": \"${username}\",
            \"motdepasse\": \"${password}\",
            \"isReLogin\": false,
            \"uuid\": \"\", 
            \"cn\": \"${cn}\",
            \"cv\": \"${cv}\",
            \"fa\": [
                {
                    \"cn\": \"${cn}\",
                    \"cv\": \"${cv}\",
                }
            ]}`,
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
        }
      })

      userinfo = await finalResponse.json()
    }



    if (userinfo.code !== 200) return <FetchingResponse>{
      success: false,
      username,
      password,
      message: userinfo.message ?? "Une erreur est survenue, merci de réessayer."
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
      doubleAuthInfo: {
        cn: cn ?? '',
        cv: cv ?? '',
      }
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

export const fetchGrades_ = async (token: string | undefined, id: string | undefined, username: string, password: string,) => {

  if (!token || !id) {
    console.log('Need a token and an id');
    return <FetchingResponse>{
      success: false,
      message: 'Error while getting grades, token or id were not gave.',
    }
  }

  console.log("getting grades with token: ", token)

  const user: UserInfo = {
    settings: {}
  }

  const options = {
    method: 'POST',
    body: "data={}",
    headers: {
      "X-Token": token ?? '',
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 RuxitSynthetic/1.0 v6886653584872488035 t8141814394349842256 ath1fb31b7a altpriv cvcv=2 cexpw=1 smf=0"
    },
  }
  try {
    let gradesInfo;

    if (!useRealData || (username == unrealUsername && password == unrealPassword)) {
      gradesInfo = require('../assets/grades.json');

    } else {

      let response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${id}/notes.awp?verbe=get&v=${apiVersion}`, options)
      gradesInfo = await response.json()

      if (gradesInfo.code !== 200) {

        if (gradesInfo.code === 520 || gradesInfo.code === 525) {

          console.log('Error with token, getting another');

          const connectionResponse = await logIn_(username, password);
          const token = connectionResponse.data?.token

          options.headers["X-Token"] = token ?? '',

            response = await fetch(`https://api.ecoledirecte.com/v3/eleves/${id}/notes.awp?verbe=get&v=${apiVersion}`, options)
          gradesInfo = await response.json();
        } else {
          console.log('error in getting grades response - gradessInfo :', gradesInfo)
          throw new Error('response code isn\'t 200')
        }
      };
    }


    if (user.settings) {
      user.settings.showGeneralAverage = gradesInfo.data.parametrage.moyenneGenerale;
      user.settings.showClassAverage = gradesInfo.data.parametrage.moyenneClasse;
      user.settings.showMaxAverage = gradesInfo.data.parametrage.moyenneMax;
      user.settings.showMinAverage = gradesInfo.data.parametrage.moyenneMin;
    }
    user.numberOfPeriod = gradesInfo.data.periodes.length - 1;
    const numberOfGrade = gradesInfo.data.notes.length;

    user.periods = [];
    user.grades = {};

    const now = Date.now();

    for (let i = 0; i < user.numberOfPeriod; i++) {

      const period = gradesInfo.data.periodes[i];
      const periodGradeIds: string[] = [];

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
          isNew: now - Date.parse(grade.dateSaisie) < 172800000,
          isOfficial: true,
        }

        periodGradeIds.push(grade.id.toString())
      }

      user.periods?.push({
        averageCalculated: calculateAverage(user.grades, periodGradeIds),
        averageClass: formatStringNumber(period.ensembleMatieres.moyenneClasse),
        averageOfficial: formatStringNumber(period.ensembleMatieres.moyenneGenerale),
        beginDate: Date.parse(period.dateDebut),
        endDate: Date.parse(period.dateFin),
        codePeriod: period.codePeriode,
        maxAverageClass: formatStringNumber(period.moyenneMax),
        minAverageClass: formatStringNumber(period.moyenneMin),
        namePeriod: period.periode,
        isEnded: period.cloture,
        disciplines: period.ensembleMatieres.disciplines.map((discipline: any) => {

          const disciplineGradeIds = Object.values(user.grades ?? {}).filter(grade => grade.codeDiscipline === discipline.codeMatiere && grade.codePeriod === period.codePeriode).map(grade => grade.id)

          const newDiscipline: Discipline = {
            averageCalculated: calculateAverage(user.grades ?? {}, disciplineGradeIds),
            averageClass: formatStringNumber(discipline.moyenneClasse),
            averageOfficial: formatStringNumber(discipline.moyenne),
            codeDiscipline: discipline.codeMatiere,
            coef: formatStringNumber(discipline.coef),
            maxAverageClass: formatStringNumber(discipline.moyenneMax),
            minAverageClass: formatStringNumber(discipline.moyenneMin),
            nameDiscipline: discipline.discipline,
            gradeIds: disciplineGradeIds,
            unofficialGradeIds: [], //TODO save entered grades
          }

          return newDiscipline;
        }),
        gradeIds: periodGradeIds,
        unofficialGradeIds: [], //TODO save entered grades

      })
    }

    const promise: FetchingResponse = {
      success: true,
      data: user,
    }

    return promise
  } catch (error) {
    console.log("error while getting grades: ", error)

    const promise: FetchingResponse = {
      success: false,
      message: 'Vérifiez votre connection et réessayez.',
    }

    return promise;
  }
}