(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["compte.vue"],{9367:function(t,e,a){"use strict";a("a9c5")},a6c2:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("button",[t._v("Page Admin Users ")]),a("div",{attrs:{id:"app"}},[a("div",{staticClass:"group__header__body"},t._l(t.users,(function(e){return a("div",{key:e.id},[a("div",{attrs:{"_ngcontent-cpa-c6":""}},[t._v(" Compte crée le:"+t._s(t._f("dateFormat")(new Date(e.createdAt),"DD/MM/YYYY"))+" à "+t._s(t._f("dateFormat")(new Date(e.createdAt),"hh:mm"))+" : "),a("br"),t._v(" dernière maj le:"+t._s(t._f("dateFormat")(new Date(e.updatedAt),"DD/MM/YYYY"))+" à "+t._s(t._f("dateFormat")(new Date(e.updatedAt),"hh:mm"))+" : "),a("br"),a("b",[t._v(t._s(e.username))]),a("br"),a("b",[t._v(t._s(e.email))]),a("br"),a("button",{on:{click:function(a){return t.destroyUser(e.id)}}},[t._v(" Supprimer utilisateur n°"+t._s(e.id)+" ")])])])})),0)])])},r=[],o=a("2b0e"),n=a("bc3a"),c=a.n(n),i=a("130e"),u=a("4380");o["a"].use(u["a"]),o["a"].use(i["a"],c.a);var d={data(){return{users:[]}},created(){c.a.get("http://localhost:3000/api/users/").then(t=>{this.users=t.data}).catch(t=>console.log(t()))},methods:{destroyUser:function(t){let e=localStorage.getItem("obj"),a=JSON.parse(e),s=a.myToken;this.axios.post("http://localhost:3000/api/users/"+t+"/del",null,{headers:{Authorization:s}}).then(t=>this.users=t.data),c.a.get("http://localhost:3000/api/users/").then(t=>{this.users=t.data}).catch(t=>console.log(t())).catch(t=>console.log(t()))}}},l=d,h=(a("9367"),a("2877")),_=Object(h["a"])(l,s,r,!1,null,"511f59b0",null);e["default"]=_.exports},a9c5:function(t,e,a){}}]);
//# sourceMappingURL=compte.vue.0c8f5261.js.map