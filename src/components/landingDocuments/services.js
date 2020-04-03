import React from "react";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";

const EviusUrl = "https://api.evius.co/api/";
//const EventID = API_ID_EVENT;

var firebaseInicializado = null;
var db = "";
var auth = "";
var storage = "";
let response = false;
// let coll_reservations = `${EventID}_reservations`;
// let coll_posts = `${EventID}_post`;
// let coll_comments = `${EventID}_comments`;
// let coll_replys = `${EventID}_replys`;
// let coll_config_ranking = `${EventID}_config_ranking`;
let points_general = {
    change_info_profile: { points: 1 },
    comment_wall: { points: 1 },
    download_doc: { points: 1 },
    post_wall: { points: 1 },
    survey_satisfaction_replay: { points: 1 },
    survey_success_reply: { points: 1 },
    upload_image_profile: { points: 1 }
};

export async function initializeVariablesAndFirebase() {
    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyDDnc9WHXf4CWwXCVggeiarYGu_xBgibJY",
        authDomain: "eviusauth.firebaseapp.com",
        databaseURL: "https://eviusauth.firebaseio.com",
        projectId: "eviusauth",
        storageBucket: "eviusauth.appspot.com",
        messagingSenderId: "400499146867",
        appId: "1:400499146867:web:5d0021573a43a1df"
    };

    let timestamp = new Date().getUTCMilliseconds();
    let random = timestamp.toString();
    firebaseInicializado = await firebase.initializeApp(
        firebaseConfig,
        `eviusV.${random}`
    );

    db = await firebaseInicializado.firestore();
    auth = await firebaseInicializado.auth();
    storage = await firebaseInicializado.storage();
}

export function getFiles(EventID, folder_id) {
    return new Promise(async (resolve, reject) => {
        let response = "";
        await axios
            .get(`${EviusUrl}events/${EventID}/getallfiles`)
            .then(docs => {
                response = docs.data.data.length != 0 ? docs.data.data : false;
            })
            .catch(err => {
                console.log(err);
            });
        resolve(response);
    });
}

