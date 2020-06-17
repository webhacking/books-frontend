import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import * as CategoryApi from 'src/types/category';

export interface CategoryState {
  items: { [key: number]: CategoryApi.Category | null };
}

export const categoryInitialState: CategoryState = {
  items: {},
};

export class CategoryReducer extends ImmerReducer<CategoryState> {
  public insertCategoryIds(payload: number[]) {
    const uniqIds = [...new Set(payload)];
    const categories: CategoryState['items'] = {};
    uniqIds.forEach((item: number) => {
      if (!this.draftState.items[item]) {
        categories[item] = null;
      }
    });
    this.draftState.items = { ...this.draftState.items, ...categories };
  }

  public setCategories(payload: CategoryApi.Category[]) {
    const categories: CategoryState['items'] = {};
    payload.forEach((category) => {
      categories[category.id] = category;
    });
    this.draftState.items = { ...this.draftState.items, ...categories };
  }
}

const innerCategoryReducer = createReducerFunction(
  CategoryReducer,
  categoryInitialState,
);
export function categoryReducer(
  state: CategoryState = categoryInitialState,
  action: AnyAction,
): CategoryState {
  if (action.type === HYDRATE) {
    return {
      items: { ...state.items, ...action.payload.categories.items },
    };
  }
  return innerCategoryReducer(state, action as any);
}
export const categoryActions = createActionCreators(CategoryReducer);
