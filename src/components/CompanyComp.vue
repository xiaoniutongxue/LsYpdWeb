<!--公司选项组件-->
<template>
    <div>
        <!--根据下面getSeries获得系列名称，并进行判断是否存在第一层数据，遍历数据-->
        <el-select v-model="value1" filterable placeholder="请先选择公司" class="series">
            <el-option
                    v-for="item in firtstListnew"
                    @mouseenter.native="getseriesFull(item.typeid,item.twoTypeId)"
                    :key="item.typeid"
                    :label="item.oneName"
                    :value="item.oneName">
            </el-option>
        </el-select>
        <!--循环遍历公司名称-->
        <el-select v-model="value" filterable placeholder="请选择公司" class="company">
            <!--给选项添加点击事件动态获取公司ID-->
            <el-option
                    v-for="item in company"
                    :key="item.factID"
                    :label="item.factName"
                    :value="item.factName"
                    @click.native="getSeries(item.factID)"
            >
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "CompanyComp",
        data(){
            return{
                /*接收公司数据的数组*/
                company: [{
                    value:'',
                    label:''
                }],
                value: '',
                /*接收系列数据的数组*/
                series:[{
                    value:'',
                    label:''
                }],
                value1:'',
                /*分别接收三层数据的数组(自己分层非后台传入)*/
                firtstListnew:[],
                secondListnew:[],
                thirdListnew:[],

                /*默认选中第三层数据的第一个*/
                DefaultSeriesId:''
            }
        },
        created() {
            this.getFactory();
            /*设置默认子选项 调用获取系列号的方法 getSeries 并且厂商号为2*/
            this.getSeries(122);
        },
        methods:{
            /*调用获取公司名称的方法 getFactory*/
            getFactory(){
                this.
                $axios
                    .get(this.IP+'/getFactory')
                    .then(response => (
                        /*得到后台返回的公司名称数组*/
                        this.company = response.data,
                            /*设置公司选项默认选择第一个*/
                            this.value=this.company[0].factName
                    ))
                    .catch(function (err) {
                        console.log('Error')
                    });
            },
            /*根据所选公司名称的ID查询系列*/
            getSeries:function(id){
                this.
                $axios
                /*根据公司id查询系列,调用获取系列名称的方法 getSeries*/
                    .get(this.IP+'/getSeries?factID='+id)
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            /*得到后台返回的系列数组*/
                            this.series = response.data;
                            /*定义三个存放数据的数组*/
                            let firstList=[];
                            let secondList=[];
                            let thirdList=[];
                            /*提取外部需要用到的变量*/
                            let twoTypeId;
                            /*循环遍历后台数据，将其分为三个数组*/
                            for(let i=0;i<=this.series.length-1;i++){
                                /*第一次层数据*/
                                let typeid=this.series[i].typeID;
                                let oneName=this.series[i].OneName;
                                /*第二层数据*/
                                let twoPid=this.series[i].twoPID;
                                twoTypeId=this.series[i].twoTypeID;
                                let twoName=this.series[i].twoName;
                                /*第三层数据*/
                                let threePid=this.series[i].threePId;
                                let seriesFullName=this.series[i].seriesFullName;
                                let SeriesId=this.series[i].seriesID;
                                /*第一层数据判断是否为空*/
                                if(typeid==null){
                                    /*处理为空数据并添加到第一层*/
                                    typeid=twoTypeId;
                                    oneName=twoName;
                                    firstList.push({typeid,oneName});
                                    /*处理第二层twopid为-1的情况*/
                                    twoPid=twoTypeId;
                                    secondList.push({twoPid,twoName,twoTypeId});
                                }else{
                                    /*数据不为空正常添加，但要将第二层twoTypeId添加到第一层*/
                                    firstList.push({typeid,oneName,twoTypeId});
                                    secondList.push({twoPid,twoName,twoTypeId});
                                }
                                /*添加第三层数据*/
                                thirdList.push({threePid,seriesFullName,SeriesId});
                            }
                            /*数据去重*/
                            this.firtstListnew=this.uniqueFirst(firstList);
                            this.secondListnew=this.uniqueSecond(secondList);
                            /*第三层数据*/
                            this.thirdListnew=thirdList;
                            /*设置系列默认选中第一项*/
                            this.value1=this.firtstListnew[0].oneName;
                            /*this.value1=this.thirdListnew[0].seriesFullName*/
                        }
                        this.DefaultSeriesId=this.thirdListnew[0].SeriesId;
                        this.$emit("DefaultSeriesId",this.DefaultSeriesId);
                    })
                    .catch(function (err) {
                        console.log('Error')
                    })
            },
            /*得到第三层数据*/
            getseriesFull:function(typeid,twoTypeId){
                /*自定义事件 子组件向父组件传递数据*/
                this.$emit('id',typeid,twoTypeId);
                this.$emit("Companylist",this.secondListnew,this.thirdListnew,true)
            },
            /*选项卡去重*/
            unique(arr) {
                const res = new Map();
                return arr.filter((arr) => !res.has(arr.typeID) && res.set(arr.typeID, 1));
            },
            /*根据typeid去重*/
            uniqueFirst(arr) {
                const res = new Map();
                return arr.filter((arr) => !res.has(arr.typeid) && res.set(arr.typeid, 1));
            },
            /*根据twoTypeId去重*/
            uniqueSecond(arr) {
                const res = new Map();
                return arr.filter((arr) => !res.has(arr.twoTypeId) && res.set(arr.twoTypeId, 1));
            },
        }
    }
</script>

<style scoped>
    @import "../assets/css/company.css";
</style>
