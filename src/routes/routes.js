import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import Correlations from 'src/pages/Correlations.vue'
import CorrelationMatrix from 'src/pages/CorrelationMatrix.vue'
import GeographicDistribution from 'src/pages/GeographicDistribution.vue'
import TrendsOverTime from 'src/pages/TrendsOverTime.vue'
import TheData from 'src/pages/TheData.vue'
import Overview from 'src/pages/Overview.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Map1 from 'src/pages/map1.vue';
import Map2 from 'src/pages/map2.vue';
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'


const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/geographic-distribution'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/geographic-distribution',
    children: [
      {
        path: 'correlations',
        name: 'Correlations',
        component: Correlations
      },
      {
        path: 'correlation-matrix',
        name: 'Correlation Matrix',
        component: CorrelationMatrix
      },
      {
        path: 'geographic-distribution',
        name: 'Geographic Distribution',
        component: GeographicDistribution
      },
      {
        path: 'trends-over-time',
        name: 'Trends Over Time',
        component: TrendsOverTime
      },
      {
        path: 'the-data',
        name: 'The Data',
        component: TheData
      },
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: '/map1',
        name: 'Map1',
        component: Map1
      },
      {
        path: '/map2',
        name: 'Map2',
        component: Map2
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      
      {
        path: 'upgrade',
        name: 'Upgrade to PRO',
        component: Upgrade
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
