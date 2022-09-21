import HomePage         from './pages/landings/home/home';
import RegisterPage     from './pages/user/register/register';
import PlayerPage       from './pages/player/player';
import MovieDetailPage  from './pages/movie/detail/movie-detail';
import VerifyPage       from './pages/user/verify/verify';
import CredentialPage   from './pages/user/credential/credential';
import AuthenticatePage from './pages/user/authenticate/authenticate';
import ProfilePage      from './pages/user/profile/profile';
import SeriesDetailPage from './pages/series/detail/series-detail';
import SeriesListPage   from './pages/series/list/series-list';
import EditProfilePage  from './pages/user/profile/edit/edit-profile';
import SearchPage      from './pages/search/search';
import ProgramMorePage from './pages/more-pages/program-more-page';
import TagMorePage     from './pages/more-pages/tag-more-page';
import SearchMorePage  from './pages/more-pages/search-more-page';
import InvoicePage     from './pages/user/invoice/invoice';
import FavListPage     from './pages/user/fav-list/fav-list';
import Purchases       from './pages/user/purchases/purchases';
import NotFound        from './pages/statics/404/not-found';
import NotAuthorized   from './pages/statics/403/not-authorized';
import ServerError     from './pages/statics/500/server-error';
import PurchaseDetails from './pages/user/purchases/purchase-details/purchase-details';
import SessionsPage    from './pages/user/sessions/sessions';

const routes = [
	{
		path     : '/',
		component: HomePage,
		exact    : true
	},
	{
		path     : '/register',
		component: RegisterPage,
		exact    : true
	},
	{
		path     : '/verify',
		component: VerifyPage,
		exact    : true
	},
	{
		path     : '/credential',
		component: CredentialPage,
		exact    : true
	},
	{
		path     : '/authenticate',
		component: AuthenticatePage,
		exact    : true
	},
	{
		path     : '/profile',
		component: ProfilePage,
		exact    : true
	},
	{
		path     : '/profile/edit',
		component: EditProfilePage,
		exact    : true
	},
	{
		path     : '/player/:id',
		component: PlayerPage,
		exact    : true
	},
	{
		path     : '/movies/:id',
		component: MovieDetailPage,
		exact    : true
	},
	{
		path     : '/series',
		component: SeriesListPage,
		exact    : true
	},
	{
		path     : '/series/:id',
		component: SeriesDetailPage,
		exact    : true
	},
	{
		path     : '/series/:id/:season/:episode',
		component: SeriesDetailPage,
		exact    : true
	},
	{
		path     : '/p/:type/:id',
		component: ProgramMorePage,
		exact    : true
	},
	{
		path     : '/p/:type/:id/:option',
		component: ProgramMorePage,
		exact    : true
	},
	{
		path     : '/t/:tagDef/:id',
		component: TagMorePage,
		exact    : true
	},
	{
		path     : '/t/:tagDef/:id/:type',
		component: TagMorePage,
		exact    : true
	},
	{
		path     : '/search',
		component: SearchPage,
		exact    : true
	},
	{
		path     : '/search/:text',
		component: SearchPage,
		exact    : true
	},
	{
		path     : '/search/:text/:type',
		component: SearchMorePage,
		exact    : true
	},
	{
		path     : '/invoice/:refId',
		component: InvoicePage,
		exact    : true
	},
	{
		path     : '/fav-list',
		component: FavListPage,
		exact    : true
	},
	{
		path     : '/purchases',
		component: Purchases,
		exact    : true
	},
	{
		path     : '/purchases/:id',
		component: PurchaseDetails,
		exact    : true
	},
	{
		path     : '/sessions',
		component: SessionsPage,
		exact    : true
	},
	{
		path     : '/403',
		component: NotAuthorized,
		exact    : true
	},
	{
		path     : '/404',
		component: NotFound,
		exact    : true
	},
	{
		path     : '/500',
		component: ServerError,
		exact    : true
	}
];
export default routes;
