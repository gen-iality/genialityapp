import { firestore } from "../../helpers/firebase";

export const setHostState = (hostId, state) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("host")
      .doc(hostId)
      .update({ busy: state })
      .then((result) => {
        resolve({ message: "El host ha sido actualizado" });
      })
      .catch((err) => {
        reject({ message: err });
      });
  });
};

export const getAllHost = () => {
  return new Promise((resolve, reject) => {
    firestore.collection("host").onSnapshot((docs) => {
      const hostList = [];
      if (docs.empty) {
        resolve(false);
      }
      docs.forEach((host) => {
        hostList.push({ _id: host.id, ...host.data() });
      });
      resolve(hostList);
    });
  });
};

export default (loadHost) => {
  firestore
    .collection("host")
    .where("busy", "==", false)
    .onSnapshot((docs) => {
      const hostList = [];
      if (!docs.empty) {
        docs.forEach((host) => {
          hostList.push({ _id: host.id, ...host.data() });
        });
        loadHost(hostList);
      }
    });
};
