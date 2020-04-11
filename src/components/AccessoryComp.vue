<template>
    <div class="Accessory">
        <!--当附件数据为空时显示h5的内容-->
        <h5 class="accisNull" v-if="Acc_AccAllData==''">暂无附件</h5>
        <!--遍历可以选择的附件数据-->
        <div class="Accessory-all" v-for="(tititem,i) in Acc_AccAllData">
            <div class="Accessory-title">
                <span>
                    {{tititem.typeName}}
                    {{tititem.typeID}}
                </span>
            </div>
            <!-- 遍历规格选项-->
            <div class="Accessory-count">
                <ul>
                    <li v-for="(optitem,j) in tititem.child" class="Accessory-count-li">
                        <el-checkbox-group v-model="checkedlist">
                            <el-checkbox :label="optitem.compID"
                                         :disabled="isdisabled(optitem.compID)">
                                <p :class="{changeColorAcc:optitem.compID==compID}"
                                   :id="optitem.compID"
                                   @click.prevent="changeColor(optitem.compID,optitem.child)">
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
                                        <div @click="getchangelist(j,divindex,optitem.child,optitem.compID)">
                                            <li v-for="(par_optitem,liindex) in par_tititem.child"
                                                :id="par_optitem.optID"
                                                v-if="isShowParli(par_optitem.optID)"
                                                :class="isCheckliParticularsOpt(divindex,liindex,par_optitem.optID)"
                                                @click="changeliColor(divindex,liindex,par_optitem.optID)"
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
            "Spe_titIdList"      /*本体规格所有标题的id组成的数组*/
        ],
        data(){
            return{
                compID:"",

                /*附件选择数据*/
                Acc_AccAllData:[],  /*附件选择所有处理好需要显示的数据*/
            }
        },
        watch:{
            accessory:{
                handler(newVal,oldVal){
                    /*获取附件选择所有数据*/
                    this.get_AccAllData(newVal);
                }
            }
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
            checkedlist(){
            },
            isdisabled(compID){},
            changeColor(){},
            getchangelist(){},
            isShowParli(){},
            isCheckliParticularsOpt(){},
            changeliColor(){},


        },
    }
</script>

<style scoped>
@import "../assets/css/accessory.css";
</style>