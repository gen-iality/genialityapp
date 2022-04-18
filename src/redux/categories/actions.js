import { CategoriesApi } from "../../helpers/request";

export function fetchCategories() {
    return async dispatch => {
        dispatch(fetchCategoriesBegin());
        try {
            const categories = await CategoriesApi.getAll();
            dispatch(fetchCategoriesSuccess(categories));
        }catch (e) {
            dispatch(fetchCategoriesFailure(e))

        }
    };
}

export const FETCH_CATEGORIES_BEGIN     = "FETCH_CATEGORIES_BEGIN";
export const FETCH_CATEGORIES_SUCCESS   = "FETCH_CATEGORIES_SUCCESS";
export const FETCH_CATEGORIES_FAILURE   = "FETCH_CATEGORIES_FAILURE";

export const fetchCategoriesBegin = () => ({
    type: FETCH_CATEGORIES_BEGIN
});

export const fetchCategoriesSuccess = categories => ({
    type: FETCH_CATEGORIES_SUCCESS,
    payload: { categories }
});

export const fetchCategoriesFailure = error => ({
    type: FETCH_CATEGORIES_FAILURE,
    payload: { error }
});