import { getInstance } from 'd2/lib/d2';

let d2;
let api;

async function init() {
    d2 = await getInstance();
    api = d2.Api.getApi();
}

export function getD2() {
    return d2;
}

export function getApi() {
    return api;
}

export function getPeriodTypes() {
    return api.get('periodTypes');
}

init();
