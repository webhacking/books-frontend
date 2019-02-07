import * as createRoutes from 'next-routes';
import Routes from 'next-routes';

import pages from './pages';

// https://github.com/fridays/next-routes/issues/181#issuecomment-391772547
// @ts-ignore
const routes: Routes = createRoutes();

interface PageOptionProps {
  name: string;
  page?: string;
  pattern?: string;
}

pages.forEach((page: PageOptionProps) => routes.add(page));

export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
