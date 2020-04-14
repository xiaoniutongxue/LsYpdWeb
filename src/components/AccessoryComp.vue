<!--附件选择模块-->
<template>
    <div class="Accessory">
        <!--当附件数据为空时显示h5的内容-->
        <h5 class="accisNull" v-if="Acc_AccAllData==''">暂无附件</h5>
        <!--遍历可以选择的附件数据-->
        <div class="Accessory-all" v-for="(tititem,i) in Acc_AccAllData" :id="tititem.typeID">
            <div class="Accessory-title">
                <span>
                    {{tititem.typeName}}
                    {{tititem.typeID}}
                </span>
            </div>
            <!-- 遍历规格选项-->
            <div class="Accessory-count">
                <ul>
                    <li class="Accessory-count-li" :id="optitem.compID" v-if="is_ShowAccOpt(optitem.compID)" v-for="(optitem,j) in tititem.child" ref="AccOpt">
                        <el-checkbox-group v-model="Acc_ParDisSelectlist">
                            <el-checkbox :label="optitem.compID"
                                         :disabled="is_disabled(optitem.compID)">
                                <p :class="{changeColorAcc:optitem.compID==compID}"
                                   :id="optitem.compID"
                                   @click.prevent="is_ShowPardiv(optitem.compID,optitem.child)">
                                    {{optitem.compName}}
                                    {{optitem.compID}}
                                </p>
                            </el-checkbox>
                        </el-checkbox-group>
                        <!--点击选项时显示详询信息-->
                        <div class="liParticulars" v-show="optitem.compID==compID">
                            <!--含有图片、价格、订货号等的div-->
                            <div class="liParticulars-top">
                                <div class="liParticulars-topimg">
                                    <img src="../assets/img/Accessary.jpg">
                                </div>
                                <ul class="liParticulars-toplist">
                                    <li>
                                        <h4>EF加长前接线端子 T1 3只</h4>
                                    </li>
                                    <li>订货号： 10044380</li>
                                    <li>￥93.15 ￥93.15</li>
                                </ul>
                            </div>
                            <!--其他信息的div-->
                            <div class="liParticulars-buttom">
                                <div class="liParticulars-buttomAll"
                                     ref="isShowDiv"
                                     :id="par_tititem.propID"
                                     :value="optitem.compID"
                                     v-for="(par_tititem,divindex) in optitem.child">
                                    <div class="liParticulars-buttom-letftit"
                                         :id="par_tititem.propID">
                                        {{par_tititem.propName}}
                                        {{par_tititem.propID}}
                                    </div>
                                    <ul class="liParticulars-buttom-rightopt">
                                        <div @click="get_AccParChangelist(divindex)">
                                            <li v-for="(par_optitem,liindex) in par_tititem.child"
                                                :id="par_optitem.optID"
                                                :value="optitem.compID"
                                                :class="is_AddClass(divindex,liindex,par_optitem.optID)"
                                                v-if="is_ShowParli(par_optitem.optID)"
                                                @click="click_AddClass(divindex,liindex,par_optitem.optID)"
                                                class="liParticulars-li">
                                                {{par_optitem.optName}}
                                                {{par_optitem.optID}}
                                            </li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <div style="clear: both"></div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AccessoryComp",
        props:[
            "accessory",         /*附件所有未处理的数据*/
            "seriesid",          /*系列id*/
            "Spe_titIdList",      /*本体规格所有标题的id组成的数组*/
            "Spe_SelectedOptlist",  /*本体规格所有选中的选项id组成的数组*/
            "Spe_SelectedValuelist", /*本体规格所有选中的选项值组成的数组*/
        ],
        data(){
            return{
                compID:"",

                /*附件选择数据*/
                Acc_AccAllData:[],  /*附件选择所有处理好需要显示的数据*/

                /*附件选择详情框*/
                Acc_ParAllList:[],     /*详情框底部的数据*/
                Acc_ParTitlist:[],     /*详情框所有标题id的数组*/
                Acc_ParTitStr:"",     /*详情框所有标题id的字符串*/
                Acc_ParOptlist:[],    /*详情框所有选项id的数组*/
                Acc_ParOptStr:"",     /*详情框所有选项id的字符串*/
                Acc_ParComplist:[],     /*附件选择所有compid组成的数组*/

                /*附件选择详情框选用状态*/
                Acc_ParStaateproplist:[],       /*选用状态数组*/
                Acc_ParDisSelectlist:[],        /*不可选数组*/
                Acc_ParDisShowlist:[],          /*不显示数组*/
                Acc_Parlist:[],                 /*详情框数组*/

                /*附件选择关系*/
                AccRel_AllRellist:[],   /*详情框所有关系*/
                AccRel_defaultTit:[],   /*有关系的标题id*/
                AccRel_defaultOpt:[],   /*有关系的选项*/
                AccRel_defalutShowOpt:[],   /*需要显示的选项*/

                /*附件选择详情框被选中的数据*/
                Acc_ClickTitindex:-1,           /*控制详情框点击选项第几个开始*/
                Acc_DefSelectedOptList:[],      /*默认选中的选项数组*/
                Acc_invariabilityOptList:[],    /*详情框内上面已经选好的数组*/
                Acc_displayOptlist:[],          /*是否显示的选项数组*/
                n:0,            /*控制是否可选只执行一次*/
                m:0,            /*控制是否显示只执行一次*/
            }
        },
        watch:{
            accessory:{
                handler(newVal,oldVal){
                    this.n=0;
                    /*获取附件选择所有数据*/
                    this.get_AccAllData(newVal);
                }
            },
            Spe_SelectedOptlist:{
                handler(newVal,oldVal){
                    this.m=0;
                    /*调用get_AccParData方法得到详情框相应数据*/
                    this.get_AccParData();

                    /*调用get_Accdynamiclist方法得到详情框关系相应数据*/
                    this.get_Accdynamiclist(this.Acc_ParTitStr,this.Acc_ParOptStr,this.seriesid,this.Acc_ParAllList)
                }
            },
        },
        methods:{
            /*得到附件选择处理好可以显示的数据*/
            get_AccAllData(list){
                let tempArr = [];
                this.Acc_AccAllData=[];
                for (let i = 0; i < list.length; i++) {
                    if (tempArr.indexOf(list[i].typeID) === -1) {
                        this.Acc_AccAllData.push({
                            typeID:list[i].typeID,
                            typeName: list[i].typeName,
                            child: [list[i]]
                        });
                        tempArr.push(list[i].typeID);
                    } else {
                        for (let j = 0; j < this.Acc_AccAllData.length; j++) {
                            if (this.Acc_AccAllData[j].typeID == list[i].typeID) {
                                this.Acc_AccAllData[j].child.push(list[i]);
                                break;
                            }
                        }
                    }
                }
            },

            /*得到详情框所有数据*/
            get_AccParData(){
                this.Acc_ParAllList=[];
                this.Acc_ParStaateproplist=[];
                this.Acc_ParDisShowlist=[];
                /*得到详情框标题和选项的所有数据*/
                for(let i=0;i<this.Acc_AccAllData.length;i++){
                    for(let j=0;j<this.Acc_AccAllData[i].child.length;j++){
                        for(let z=0;z<this.Acc_AccAllData[i].child[j].child.length;z++){
                            /*得到所有详情框标题和选项数组*/
                            this.Acc_ParAllList.push(this.Acc_AccAllData[i].child[j].child[z]);
                            if(this.Acc_AccAllData[i].child[j].child[z].propName=="选用状态"){
                                /*得到所有选用状态数组*/
                                this.Acc_ParStaateproplist.push(this.Acc_AccAllData[i].child[j].child[z].propID)
                                for(let s=0;s<this.Acc_AccAllData[i].child[j].child[z].child.length;s++){
                                    /*得到所有不选用和compid数组对象*/
                                    if(this.Acc_AccAllData[i].child[j].child[z].child[s].optName=="不选用"){
                                        this.Acc_ParDisShowlist.push({
                                            compid:this.Acc_AccAllData[i].child[j].compID,
                                            optid:this.Acc_AccAllData[i].child[j].child[z].child[s].optID
                                        })
                                    }
                                }
                            }else{
                                continue
                            }
                        }
                    }
                }
                this.get_AccTitandOptStr(this.Acc_ParAllList);
            },

            /*得到附件选择所有的关系数据及详情框需要显示的选项id*/
            get_Accdynamiclist(titleIdStr,optionIdStr,seriesid,list){
                /*判断有无附件*/
                if(titleIdStr==""){
                    console.log("暂无附件");
                    return;
                }
                this.$axios
                    .get(this.IP+'/get_proprel?propSet='+titleIdStr+'&optSet='+optionIdStr+'&series_id='+seriesid)
                    .then(response => {
                        /*接收到后台传入的所有关系数据*/
                        this.AccRel_AllRellist=response.data;

                        /*处理选用状态，看是否可选*/
                        if(this.n==0){
                            this.n++;
                            this.Acc_ParDisSelectlist=[];
                            let disselect;
                            for(let i=0;i<this.AccRel_AllRellist.length;i++){
                                if(this.Acc_ParStaateproplist.includes(this.AccRel_AllRellist[i].fPropID)){
                                    disselect=document.getElementById(this.AccRel_AllRellist[i].fPropID).getAttribute("value");
                                    this.Acc_ParDisSelectlist.push(parseInt(disselect))
                                }
                            }
                        }

                        /*得到需要改变的标题id数组及其默认选项*/
                        this.AccRel_defaultTit=[];
                        this.AccRel_defaultOpt=[];
                        /*循环遍历出该数组*/
                        for (let i=0;i<this.AccRel_AllRellist.length;i++){
                            let propertyDefaultId=this.AccRel_AllRellist[i].fPropID;
                            this.AccRel_defaultTit.push(propertyDefaultId);
                            let propertyDecaultId=this.AccRel_AllRellist[i].fOptDefaultID;
                            this.AccRel_defaultOpt.push(propertyDecaultId);
                        }

                        this.AccRel_defalutShowOpt=[];
                        let relindex=0,fOptIDs;
                        /*遍历出需要显示的所有选项*/
                        for(let i=0;i<this.Acc_ParTitlist.length;i++){
                            if(this.AccRel_defaultTit.includes(this.Acc_ParTitlist[i])){
                                relindex=this.get_Arrindex(this.AccRel_defaultTit,this.Acc_ParTitlist[i]);
                                fOptIDs=this.AccRel_AllRellist[relindex].fOptIDs.split(",");
                                for(let j=0;j<fOptIDs.length;j++){
                                    this.AccRel_defalutShowOpt.push(parseInt(fOptIDs[j]))
                                }
                            }
                            else{
                                for(let j=0;j<list[i].child.length;j++){
                                    this.AccRel_defalutShowOpt.push(list[i].child[j].optID)
                                }
                            }
                        }
                        /*console.log(this.AccRel_defalutShowOpt);*/

                        /*get_AccDefaultSellist()方法获取默认选中id数组*/
                        /*let s=performance.now();*/
                        this.get_AccDefaultSellist(list);
                        /*let ss=performance.now();
                        console.log(ss-s)*/
                    })
                    .catch(function (err) {
                        console.log('Error')
                    });
            },

            /*得到详情框默认选中的选项id数组*/
            get_AccDefaultSellist(){
                this.Acc_DefSelectedOptList=[];
                /*得到点击时该标题以上已经选中的选项*/
                if(this.Acc_invariabilityOptList!=""){
                    for(let i=0;i<this.Acc_invariabilityOptList.length;i++){
                        this.Acc_DefSelectedOptList.push(this.Acc_invariabilityOptList[i]);
                    }
                }
                /*得到点击时该标题以下已经选中的选项*/
                let index,reltit;
                let len=this.Acc_ParTitlist.length;
                for (let i=this.Acc_ClickTitindex+1;i<len;i++){
                    /*需要改变的选项，添加默认fOptDefaultID*/
                    if(this.AccRel_defaultTit.includes(this.Acc_ParTitlist[i])){
                        reltit=this.get_Arrindex(this.AccRel_defaultTit,this.Acc_ParTitlist[i]);
                        index=this.AccRel_defaultOpt[reltit]
                    }
                    /*没有改变的选项,看之前是否有选中的，有就添加那一项，没有就添加第一项*/
                    else{
                        index=this.Acc_ParOptlist[i]
                    }
                    this.Acc_DefSelectedOptList.push(index);
                }
                /*判断是否第一次执行获取是否显示的数组*/
                if(this.m==0){
                    /*得到隐藏的选项id数组*/
                    this.Acc_displayOptlist=[];
                    let i=0;
                    for(i in this.Acc_ParDisShowlist){
                        if(this.Acc_DefSelectedOptList.includes(this.Acc_ParDisShowlist[i].optid)){
                            this.Acc_displayOptlist.push(this.Acc_ParDisShowlist[i].compid);
                        }
                    }
                }
            },

            /*点击选项时触发获得详情框的数据*/
            get_AccOptitemlist(compID,child){
                /*点击选项时获得该选项默认的标题和选项id字符串*/
                this.get_AccTitandOptStr(child);
                /*调用is_Showlidiv方法判断详情框哪些需要隐藏*/
                this.is_Showlidiv(compID,child);
                /*点击选项时请求该选项的数据*/
                this.get_Accdynamiclist(this.Acc_ParTitStr,this.Acc_ParOptStr,this.seriesid,this.Acc_Parlist)
            },

            /*点击详情框的li时触发得到详情框变换的数据*/
            get_AccParChangelist(divindex){
                /*遍历出点击时选项之前已经选好的选项数组id*/
                let optionId=document.getElementsByClassName('changeParcolor');
                this.Acc_invariabilityOptList=[];
                for(let j=0;j<=divindex;j++){
                    this.Acc_invariabilityOptList.push(parseInt(optionId[j].id));
                }

                let OptionIds="";
                for(let i=0;i<optionId.length;i++){
                    OptionIds=OptionIds+"-"+optionId[i].id;
                    this.Acc_ParOptlist.push(parseInt(optionId[i].id))
                }
                let optionIdStr=OptionIds.substring(1,OptionIds.length);
                this.Acc_ClickTitindex=divindex;
                this.Acc_ParOptStr=optionIdStr;
                this.get_Accdynamiclist(this.Acc_ParTitStr,this.Acc_ParOptStr,this.seriesid,this.Acc_Parlist)
            },

            /*得到默认的标题id和选项id字符串*/
            get_AccTitandOptStr(list){
                /*得到所有标题id和选项id组成的字符串*/
                let Acctit="",Accoptitem="",Accopt="";
                let fpropindex;
                this.Acc_ParTitlist=[],this.Acc_ParOptlist=[];
                this.Acc_ParTitStr="",this.Acc_ParOptStr="";
                let partitlist=[],paroptlist=[];
                for(let i=0;i<list.length;i++){
                    partitlist.push(list[i].propID);        /*将每个标题id添加进标题id数组*/
                    Acctit=Acctit+'-'+list[i].propID;
                    if(this.Spe_titIdList.includes(list[i].fPropId)){
                        fpropindex=this.get_Arrindex(this.Spe_titIdList,list[i].fPropId);
                        for(let j=0;j<list[i].child.length;j++){
                            if(list[i].child[j].optValue==this.Spe_SelectedValuelist[fpropindex]){
                                Accoptitem=list[i].child[j].optID;
                            }
                        }
                    }else{
                        Accoptitem=list[i].child[0].optID
                    }
                    Accopt=Accopt+"-"+Accoptitem;
                    paroptlist.push(Accoptitem);           /*将每个选项id添加进选项id数组*/
                }
                this.Acc_Parlist=list;
                this.Acc_ParTitlist=partitlist;
                this.Acc_ParOptlist=paroptlist;
                this.Acc_ParTitStr=Acctit.substring(1,Acctit.length);       /*所有标题id组成的字符串*/
                this.Acc_ParOptStr=Accopt.substring(1,Accopt.length);       /*所有选项id组成的字符串*/
                /*console.log(this.Acc_ParTitStr)
                console.log(this.Acc_ParOptStr)*/
            },

            /*得到数组中某一个数据的下标*/
            get_Arrindex(arr,value){
                for(let i=0;i<arr.length;i++){
                    if(arr[i]==value){
                        return i
                    }
                }
            },

            /*控制是否显示详情框*/
            is_ShowPardiv(compID,child){
                /*判断第一次点击显示详情页，再次点击隐藏详情页*/
                if(this.compID!=compID){
                    this.compID=compID;
                }else{
                    this.compID=0;
                }

                this.m=1;
                this.Acc_invariabilityOptList=[];
                this.Acc_ClickTitindex=-1;
                this.get_AccOptitemlist(compID,child);
            },

            /*控制显示哪些选项*/
            is_ShowParli(optID){
                return this.AccRel_defalutShowOpt.includes(optID)
            },

            /*控制是否被选中*/
            is_AddClass(divindex,liindex,optID){
                return {changeParcolor:this.Acc_DefSelectedOptList[divindex]===optID}
                /*return {changeParcolor:this.Acc_DefSelectedOptList.includes(optID)}*/
            },

            /*判断isShow是否=1*/
            is_Showlidiv(compID,list){
                let divtitandopt=[];
                let a;
                for(a in list){
                    divtitandopt.push(list[a].propID);
                }
                let isdisplay=this.$refs.isShowDiv;
                let listnew=[];
                let i;
                for(i in isdisplay){
                    if(divtitandopt.includes(parseInt(isdisplay[i].id))){
                        listnew.push(isdisplay[i])
                    }
                }
                for (let i=0;i<listnew.length;i++){
                    if(list[i].isShow==0){
                        listnew[i].style.display="none"
                    }else{
                        listnew[i].style.display="block"
                    }
                }
            },

            /*判断是否显示选项*/
            is_ShowAccOpt(compID){
                if(this.Acc_displayOptlist.includes(compID)){
                    return false
                }else{
                    return true
                }
            },

            /*判断是否可选*/
            is_disabled(compID){
                if(this.Acc_ParDisSelectlist.includes(compID)){
                    return true
                }else{
                    return false
                }
            },

            /*点击时让选项选中*/
            click_AddClass(divindex,liindex,optID){
                this.Acc_DefSelectedOptList[divindex]=optID;
                this.$forceUpdate();
            },

            changeColor(){},
        },
    }
</script>

<style scoped>
@import "../assets/css/accessory.css";
</style>