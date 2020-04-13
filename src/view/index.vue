<template>
    <div class="web-all">
        <!--头部框-->
        <el-row>
            <el-col :span="24">
                <div class="web-top">
                    <CompanyComp
                            @id="get_id"
                            @Companylist="get_Complist"
                            @DefaultSeriesId="get_DefaultSeriesId">
                    </CompanyComp>
                </div>
            </el-col>
        </el-row>

        <!--中间框-->
        <el-row class="web-body">
            <!--左边产品规格及附件选择-->
            <el-col :span="9" class="body-left">
                <div class="grid-content bg-purple">
                    <el-tabs v-model="DefTabsSpe" type="card">
                        <el-tab-pane label="本体规格" name="first">
                            <SpecificationComp
                                    :seriesid="seriesid"
                                    :specification="specification"
                                    @Specificationlist="get_Specificationlist"
                            ></SpecificationComp>
                        </el-tab-pane>
                        <el-tab-pane label="附件选择" name="second">
                            <AccessoryComp
                                    :Spe_titIdList="Spe_titIdList"
                                    :Spe_SelectedOptlist="Spe_SelectedOptlist"
                                    :Spe_SelectedValuelist="Spe_SelectedValuelist"
                                    :seriesid="seriesid"
                                    :accessory="accessory"
                            ></AccessoryComp>
                        </el-tab-pane>
                    </el-tabs>
                    <!--循环遍历产品类型-->
                    <div class="xilie-content" v-show="seencon" @mouseleave="hideThird">
                        <div class="xilie-condiv" v-for="item in secondlistnewshow">
                            <h1>{{item.twoName}}</h1>
                            <ul class="xilie-content-ul">
                                <!--根据第二层twoTypeId查询出第三层数据-->
                                <li v-for="items in thirdlist"
                                    v-if="item.twoTypeId==items.threePid"
                                    @click="hideThird(items.seriesFullName),get_serieslist(items.SeriesId)">
                                    {{items.seriesFullName}}
                                    {{items.SeriesId}}
                                </li>
                                <div style="clear: both"></div>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-col>
            <!--右边产品价格及特性参数-->
            <el-col :span="15" class="body-right">
                <div class="grid-content bg-purple-light">
                    <!--右边标签页-->
                    <!--价格及其参数显示-->
                    <el-tabs v-model="DefTabsSpr" type="card">
                        <el-tab-pane label="产品价格" name="first">
                            <PriceComp
                                    :combID="combID"
                                    :seriesid="seriesid"
                                    :Spe_optIdStr="Spe_optIdStr"
                            ></PriceComp>
                        </el-tab-pane>
                        <el-tab-pane label="特性参数" name="second">
                            <ParameterCopm
                                    :seriesid="seriesid"
                                    :Spe_optIdStr="Spe_optIdStr"
                            ></ParameterCopm>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /*导入子组件*/
    import CompanyComp from "../components/CompanyComp";    /*公司选择组件*/
    import SpecificationComp from "../components/SpecificationComp";    /*本体规格组件*/
    import AccessoryComp from "../components/AccessoryComp";    /*附件选择组件*/
    import PriceComp from "../components/PriceComp";        /*产品价格组件*/
    import ParameterCopm from "../components/ParameterCopm";    /*特性参数组件*/

    export default {
        name: "index",
        data(){
            return{
                DefTabsSpe:"first",   /*设置默认选择本体规格*/
                DefTabsSpr:"first",   /*设置默认选择产品价格*/

                /*系列模块数据*/
                seencon:'',         /*判断是否隐藏*/
                typeid:"",
                twotypeid:"",
                secondlistnewshow:[],   /*第二层数据*/
                thirdlist:[],           /*第三层数据*/
                seriesid:"",            /*第三层系列id*/
                DefaultSeriesId:'',     /*每个公司的默认选项*/

                /*本体规格模块数据*/
                specification:[],   /*本体规格模块所有数据*/
                combID:'',
                Spe_titIdList:"",        /*本体规格标题变换的字符串*/
                Spe_optIdStr:"",        /*本体规格选项变换的字符串*/
                Spe_SelectedOptlist:"", /*本体规格选中选项的数组*/
                Spe_SelectedValuelist:"",   /*本体规格选中选项值的数组*/

                /*附件选择模块数据*/
                accessory:[],   /*附件选择模块所有数据*/
            }
        },
        watch:{
            /*监听第三层系列号改变后的id*/
            DefaultSeriesId(){
                this.get_serieslist(this.DefaultSeriesId);
            }
        },
        methods:{
            /*
            * 系列模块方法
            * */
            /*获得系列子组件穿过来的id值*/
            get_id(typeid,twoTypeId){
                this.typeid=typeid;
                this.twotypeid=twoTypeId
            },

            /*得到公司模块传入的数据*/
            get_Complist(secondListnew,thirdListnew,seencon){
                this.secondlistnewshow=[];
                for(let i=0;i<=secondListnew.length-1;i++){
                    if(secondListnew[i].twoPid!=this.typeid){
                        continue
                    }
                    this.secondlistnewshow.push(secondListnew[i])
                }
                this.thirdlist=thirdListnew;
                this.seencon=seencon;
            },

            /*得到默认系列id*/
            get_DefaultSeriesId(DefaultSeriesId){
                this.DefaultSeriesId=DefaultSeriesId
            },

            /*控制是否显示第三层*/
            /*显示第三层*/
            showThird(){
                this.seencon=true;
            },

            /*隐藏第三层*/
            hideThird(seriesFullName){
                this.seencon=false;
                if(typeof seriesFullName=="string"){
                    this.seriesFullName=seriesFullName
                }
            },

            /*
            * 本体规格模块数据
            * */

            /*根据第三层数据的id值查询出本体规格数据所有的数据*/
            get_serieslist(id){
                this.$axios
                    .get(this.IP+'/get_all_prop?seriesId='+id)
                    .then(response => {
                        /*接收到后台传入的所有数据*/
                        let property = response.data;
                        /*根据isMain字段使用for循环分离出模块数据*/
                        this.accessory=[];
                        let accessoryList=[];
                        for(let i=0;i<property.length;i++){
                            /*当isMain为1时为本体规格模块数据*/
                            if(property[i].isMain==1){
                                /*得到本体规格模块所有标题及选项数据*/
                                this.specification=property[i].child;
                                this.combID=property[i].compID
                            }
                            /*当isMain为-1时为附件选择模块数据*/
                            if(property[i].isMain==0){
                                accessoryList=property[i];
                                this.accessory.push.apply(this.accessory,[accessoryList])
                            }
                        }
                        /*得到点击时的系列id*/
                        this.seriesid=id
                    })
                    .catch(function (err) {
                        console.log('Error')
                    });
            },

            /*得到本体规格选项变换的数据*/
            get_Specificationlist(Spe_optIdStr,Spe_titIdList,Spe_SelectedOptlist,Spe_SelectedValuelist){
                this.Spe_optIdStr=Spe_optIdStr;
                this.Spe_titIdList=Spe_titIdList;
                this.Spe_SelectedOptlist=Spe_SelectedOptlist;
                this.Spe_SelectedValuelist=Spe_SelectedValuelist;
            },

            /*
            * 附件选择模块数据
            * */

        },
        /*注册组件*/
        components:{
            CompanyComp,        /*注册公司组件*/
            SpecificationComp,  /*注册本体规格组件*/
            AccessoryComp,      /*注册附加选择组件*/
            PriceComp,          /*注册产品价格组件*/
            ParameterCopm       /*注册特性参数组件*/
        }
    }
</script>

<style scoped>
@import "../assets/css/index.css";
</style>