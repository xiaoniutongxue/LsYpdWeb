<!--产品价格模块-->
<template>
    <div class="Price-all">
        <div class="Price-top">
            <div class="Price-name">
                <h3>ZB65-63/4P C25A</h3>
            </div>
            <div class="Price-count">
                <div class="Price-count-left">
                    <img src="../assets/img/1.png">
                </div>
                <div class="Price-count-right">
                    <p class="Pr-categary">
                        <span>品类：</span>
                        <span>{{Spe_optIdStr}}</span>
                    </p>
                    <p class="Pr-Price">
                        <span class="label">￥</span>
                        <span class="price">57.00</span>
                        <span class="date">(2019/01/02)</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="Price-buttom">
            <el-table :data="PriceList" border style="width: 100%" class="table">
                <el-table-column prop="combName" label="部件名称" width="200"></el-table-column>
                <el-table-column prop="'orderNumber'" label="订单号" width="180"></el-table-column>
                <el-table-column prop="price" label="表价"></el-table-column>
                <el-table-column prop="discount" label="折扣"></el-table-column>
                <el-table-column prop="price" label="折扣后"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PriceComp",
        props:[
            "Spe_optIdStr",   //本体规格选项选中的id字符串
            "seriesid",      //系列id
            "combID"
        ],
        data(){
            return{
                PriceList:[],
                tableData: [{
                    name: 'ME09A31W04 Mpro20',
                    orderNumber: '',
                    tableprice: '0.00',
                    discount:"100%",
                    discountback:"0.00"
                }]
            }
        },
        watch:{
            Spe_optIdStr:function(){
                this.getcombination(this.combID,this.Spe_optIdStr,this.seriesid)
            }
        },
        methods:{
            /*得到价格数据*/
            getcombination(compSet,optSet,seriesid){
                this.$axios
                    .get(this.IP+'/get_combination?compSet='+compSet+'&optSet='+optSet+'&series_id='+seriesid)
                    .then(response => {
                        this.PriceList=response.data;
                    })
                    .catch(function (err) {
                        console.log('Error')
                    });
            },
        }
    }
</script>

<style scoped>
@import "../assets/css/price.css";
</style>