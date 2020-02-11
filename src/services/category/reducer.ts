import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import * as CategoryApi from 'src/types/category';

export interface CategoryState {
  items: { [key: number]: CategoryApi.Category | null };
  isFetching: boolean;
}

export const categoryInitialState: CategoryState = {
  items: {},
  isFetching: false,
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
    this.draftState.isFetching = true;
    this.draftState.items = { ...this.draftState.items, ...categories };
  }

  public setCategories(payload: CategoryApi.Category[]) {
    const categories: CategoryState['items'] = {};
    payload.forEach((category) => {
      if (this.draftState.items[category.id] === null) {
        categories[category.id] = category;
      }
    });
    this.draftState.items = { ...this.draftState.items, ...categories };
  }

  public setFetching(payload: boolean) {
    this.draftState.isFetching = payload;
  }
}

export const categoryReducer = createReducerFunction(
  CategoryReducer,
  categoryInitialState,
);
export const categoryActions = createActionCreators(CategoryReducer);
