<template>
    <div class="Specifica" id="classlist">
        <!--遍历可以选择的规格标题-->
        <div class="Specifica-all"
             :id="tititem.propID"
             ref="isShowDiv"
             v-for="(tititem,i) in specification">
            <div class="Specifica-title" :id="tititem.propID">
                    <span>
                        {{tititem.propName}}
                        {{tititem.propID}}
                    </span>
            </div>
            <!-- 遍历规格选项-->
            <div class="Specifica-count">
                <ul>
                    <!--@click点击事件 getopPropIDandoptID:得到该选项的父id和子id  changeColor:当点击该项时改变当前项的颜色-->
                    <div @click="get_ClickOptlist(i)">
                        <li :id="optitem.optID"
                            :class="is_changeClass(i,optitem.optID)"
                            :value="i"
                            :name="optitem.optValue"
                            v-for="(optitem,j) in tititem.child"
                            v-if="is_ShowOpt(optitem.optID)"
                            @click="is_changeColor(i,j,tititem.propID,optitem.optID)">
                            {{optitem.optName}}
                            {{optitem.optID}}
                        </li>
                    </div>
                    <div style="clear: both"></div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SpecificationComp",
        props:["specification","seriesid"],
        data(){
            return{
                /*本体规格默认*/
                Spe_originalTitleIdList:[],     /*原始默认的标题id组成的数组*/
                Spe_originalTitleIdStr:"",      /*原始默认的标题id组成的字符串*/
                Spe_originalOptionIdStr:"",     /*原始默认的选项id组成的字符串*/

                /*本体规格关系*/
                SpeRel_AllRellist:[],
                SpeRel_defaultTit:'',       /*含有关系的标题数组*/
                SpeRel_defaultOpt:'',       /*含有关系的选项数组*/
                SpeRel_defalutShowOpt:'',    /*需要显示的选项数组*/

                /*本体规格数据*/
                Spe_ClickTitindex:-1,       /*点击时的标题下标，默认为-1*/
                Spe_DefSelectedOptList:[],  /*得到的默认选中的选项id数组*/
                Spe_invariabilityOptList:[], /*点击时该选项上面的选项组成的数组*/
                Spe_OptVlueList:[],         /*本体规格选项的value值组成的数组*/
            }
        },
        watch:{
            specification:{
                handler(newVal,oldVal){
                    this.Spe_ClickTitindex=-1;
                    this.Spe_invariabilityOptList=[];
                    this.get_DefaultTitAndOpt(newVal);
                }
            },
            Spe_originalOptionIdStr:{
                handler(newVal,oldVal){
                    this.get_Spedynamiclist(this.Spe_originalTitleIdStr,newVal,this.seriesid);
                }
            }
        },
        updated(){
            /*当数据更新时调用is_Showdiv方法判断选项是否为空*/
            this.is_Showdiv();
        },
        methods:{
            /*判断是否被默认选中*/
            is_changeClass(i,optID){
                return {changeColor:this.Spe_DefSelectedOptList[i]===optID}
            },

            /*判断哪些时需要显示的选项*/
            is_ShowOpt(optID){
                return this.SpeRel_defalutShowOpt.includes(optID);
            },

            /*判断当点击时选中点击的选项*/
            is_changeColor(i,j,propID,optID){
                this.Spe_DefSelectedOptList[i]=optID;        /*点击时将点击的选项id赋值给选中选项*/
                this.$forceUpdate();        /*Vue强制刷新事件*/
            },

            /*判断选项值为null时隐藏该div*/
            is_Showdiv(){
                let isdisplay=this.$refs.isShowDiv;
                isdisplay[0].style.display="none";
                let optionId=document.getElementsByClassName('changeColor');
                for (let i=1;i<optionId.length;i++){
                    if(optionId[i].innerText.trim()=="null"){
                        isdisplay[i].style.display="none"
                    }else{
                        isdisplay[i].style.display="block"
                    }
                }
            },

            /*得到默认标题和选项组成的字符串*/
            get_DefaultTitAndOpt(list){
                /*得到原始的标题propID组成的字符串*/
                let titletpropIDs="";
                this.Spe_originalTitleIdList=[];
                for(let i=0;i<list.length;i++){
                    titletpropIDs=titletpropIDs+"-"+list[i].propID;
                    this.Spe_originalTitleIdList.push(list[i].propID);
                }
                this.Spe_originalTitleIdStr=titletpropIDs.substring(1,titletpropIDs.length);

                /*得到原始的选项optID组成的字符串*/
                let OptionIds="";
                for(let i=0;i<list.length;i++){
                    OptionIds=OptionIds+"-"+list[i].child[0].optID;
                }
                this.Spe_originalOptionIdStr=OptionIds.substring(1,OptionIds.length);
            },

            /*根据选中的选项动态获取选项显示数据*/
            get_Spedynamiclist(titleIdStr,optionIdStr,seriesid){
                this.$axios
                    .get(this.IP+'/get_proprel?propSet='+titleIdStr+'&optSet='+optionIdStr+'&series_id='+seriesid)
                    .then(response => {
                        /*接收到后台传入的所有数据*/
                        this.SpeRel_AllRellist=response.data;
                        /*得到需要改变的标题id数组及其默认选项*/
                        this.SpeRel_defaultTit=[];
                        this.SpeRel_defaultOpt=[];
                        /*循环遍历出该数组*/
                        for (let i=0;i<this.SpeRel_AllRellist.length;i++){
                            let propertyDefaultId=this.SpeRel_AllRellist[i].fPropID;
                            this.SpeRel_defaultTit.push(propertyDefaultId);
                            let propertyDecaultId=this.SpeRel_AllRellist[i].fOptDefaultID;
                            this.SpeRel_defaultOpt.push(propertyDecaultId);
                        }

                        this.SpeRel_defalutShowOpt=[];
                        let relindex=0;
                        /*遍历出需要显示的所有选项*/
                        for(let i=0;i<this.Spe_originalTitleIdList.length;i++){
                            if(this.SpeRel_defaultTit.includes(this.Spe_originalTitleIdList[i])){
                                let fOptIDs=this.SpeRel_AllRellist[relindex].fOptIDs.split(",");
                                relindex++;
                                for(let j=0;j<fOptIDs.length;j++){
                                    this.SpeRel_defalutShowOpt.push(parseInt(fOptIDs[j]))
                                }
                            }
                            else{
                                for(let j=0;j<this.specification[i].child.length;j++){
                                    this.SpeRel_defalutShowOpt.push(this.specification[i].child[j].optID)
                                }
                            }
                        }
                        /*get_DefSelectedOptlist()方法获取默认选中id数组*/
                        this.get_DefSelectedOptlist();
                    })
                    .catch(function (err) {
                        console.log('Error')
                    });
            },

            /*得到默认显示的选项id组成的数组*/
            get_DefSelectedOptlist(){
                this.Spe_DefSelectedOptList=[];
                /*得到点击时该标题以上已经选中的选项*/
                if(this.Spe_invariabilityOptList!=""){
                    for(let i=0;i<this.Spe_invariabilityOptList.length;i++){
                        this.Spe_DefSelectedOptList.push(this.Spe_invariabilityOptList[i]);
                    }
                }

                /*得到点击时该标题以下已经选中的选项*/
                let index,reltit;
                for (let i=this.Spe_ClickTitindex+1;i<this.Spe_originalTitleIdList.length;i++){
                    /*需要改变的选项，添加默认fOptDefaultID*/
                    if(this.SpeRel_defaultTit.includes(this.Spe_originalTitleIdList[i])){
                        reltit=this.get_Arrindex(this.SpeRel_defaultTit,this.Spe_originalTitleIdList[i]);
                        index=this.SpeRel_AllRellist[reltit].fOptDefaultID;
                    }
                    /*没有改变的选项,添加第一个*/
                    else{
                        reltit=this.get_Arrindex(this.Spe_originalTitleIdList,this.Spe_originalTitleIdList[i]);
                        index=this.specification[reltit].child[0].optID;
                    }
                    this.Spe_DefSelectedOptList.push(index);
                }
                /*循环得到选中的选项id组成的字符串*/
                let SelectedOpt="";
                for(let i=0;i<this.Spe_DefSelectedOptList.length;i++){
                    SelectedOpt=SelectedOpt+'-'+this.Spe_DefSelectedOptList[i];
                }
                let DefSelectedOptStr=SelectedOpt.substring(1,SelectedOpt.length);
                /*将本体规格选中的标题id和选项id组成的字符串传入父组件*/
                this.$emit("Specificationlist",DefSelectedOptStr,this.Spe_originalTitleIdList)
            },

            /*得到点击时选项id组成的数组*/
            get_ClickOptlist(i){
                /*遍历出点击时选项之前已经选好的选项数组id*/
                let optionId=document.getElementsByClassName('changeColor');
                this.Spe_invariabilityOptList=[];
                for(let j=0;j<=i;j++){
                    this.Spe_invariabilityOptList.push(parseInt(optionId[j].id));
                }

                /*获取本体规格所有选项的id组成的字符串*/
                let OptionIds="";
                for(let i=0;i<optionId.length;i++){
                    OptionIds=OptionIds+"-"+optionId[i].id;
                }
                this.Spe_originalOptionIdStr=OptionIds.substring(1,OptionIds.length);
                this.Spe_ClickTitindex=i;
            },

            /*得到数组中某一个数据的下标*/
            get_Arrindex(arr,value){
                for(let i=0;i<arr.length;i++){
                    if(arr[i]==value){
                        return i
                    }
                }
            },
        },
    }
</script>

<style scoped>
@import "../assets/css/specification.css";
</style>