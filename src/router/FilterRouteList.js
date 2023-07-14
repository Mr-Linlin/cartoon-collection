// 路由剔除类
import dynamic from "./routerData/dynamic";
import router from './index'

class FilterRouteList {
  constructor(options) {
    this.menu = options;
    this.init();
  }
  // 初始化
  init() {
    const routeList = this.treeFilter(dynamic, this.menu)
    // console.log(routeList, '获取到路由=====》',dynamic);
    this.setRouter(routeList)

  }
  /**
   * 
   * @param routes 未添加的静态路由
   * @param menu 服务器返回的菜单
   * @return 匹配路由
   */
  treeFilter(routes, menu) {
    // console.log('开始匹配路由', routes);
    const menus = [];
    routes.forEach((item) => {
      const res = menu.find((v) => v.path.includes(item.path))
      if (res) {
        if (item.children && item.children.length > 0) {
          item.children = this.treeFilter(item.children, res.children);
        }
        menus.push(item)

      }
    })
    return menus;
  }
  /**
  * @param routes 匹配好的全新路由
  * @return 动态添加路由
  */
  setRouter(routes) {
    console.log(routes);
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i]
      // console.log(item);

      router.addRoute(item)
    }
    console.log(router, '路由');

  }
}

export default FilterRouteList;