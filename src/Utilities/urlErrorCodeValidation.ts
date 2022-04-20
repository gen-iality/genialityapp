// this function validates us if there is an error in a page to load in an ifrmae
export const urlErrorCodeValidation = (url: string) => {
  let http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();

  if (http.status == 200) return false;
  else return true;
};
