/**
 * Menu           菜单容器 - 负责提供一个容器
 * MenuItem       菜单项 - 负责渲染单个菜单项
 * MenuItemGroup
 * SubMenu
 */
import Menu from "./Menu";
import MenuItemGroup from "./MenuItemGroup";
import MenuItem from "./MenuItem";
import SubMenu from "./SubMenu";

Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;
Menu.MenuItemGroup = MenuItemGroup;

export default Menu;
