import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Pabody from "./components/basic/PaBody";
import PaTitle from "./components/basic/PaTitle";
import PaTable from "./components/basic/PaTable";
import PaTitleZ from "./components/basic/PaTitleZ";
import {
    Button,
    Input,
    Select,
    Option,
    Upload,
    Icon,
    Message,
    Checkbox,
    CheckboxGroup,
    Dialog,
    Popover,
    Avatar,
    Menu,
    Submenu,
    Container,
    Backtop,
    Aside,
    Main,
    MenuItem,
    MenuItemGroup,
    Pagination,
    DatePicker,
    Tree,
    Tag,
    Table,
    TableColumn,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Autocomplete,
    Scrollbar,
    Collapse,
    CollapseItem,
    Card,
    TabPane,
    Tabs,
    Row,
    Col,
    Timeline,
    TimelineItem,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/element.scss";
import "@/assets/css/common.scss";
import infiniteScroll from 'vue-infinite-scroll'
import { Loading } from 'element-ui';
Vue.use(Pabody)
    .use(PaTitle)
    .use(PaTable)
    .use(PaTitleZ)
    .use(Button)
    .use(Select)
    .use(Option)
    .use(Input)
    .use(Upload)
    .use(Icon)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Dialog)
    .use(Popover)
    .use(Avatar)
    .use(Menu)
    .use(Submenu)
    .use(Container)
    .use(Backtop)
    .use(Aside)
    .use(Main)
    .use(MenuItem)
    .use(MenuItemGroup)
    .use(Pagination)
    .use(DatePicker)
    .use(Tree)
    .use(Tag)
    .use(Table)
    .use(TableColumn)
    .use(Dropdown)
    .use(DropdownMenu)
    .use(DropdownItem)
    .use(Autocomplete)
    .use(Scrollbar)
    .use(Collapse)
    .use(CollapseItem)
    .use(Card)
    .use(Tabs)
    .use(TabPane)
    .use(Row)
    .use(Col)
    .use(Timeline)
    .use(TimelineItem)
    .use(infiniteScroll)
    .use(Loading)
Vue.prototype.$message = Message;
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
