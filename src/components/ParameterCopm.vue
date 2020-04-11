<template>
    <div class="Charector">
        <h5 class="charector-null" v-if="charector==''">数据维护中...</h5>
        <div class="charector-all" v-for="charectortit in charector" ref="divall">
            <!--v-if="titidlist.includes(charectortit.c_compID)"-->
            <div class="charector-tit"
                 :id="charectortit.c_compID"
            >
                <h5>{{charectortit.compName}}</h5>
            </div>
            <ul class="charector-opt">
                <li v-for="charectoropt in charectortit.child" v-if="is_Showli(charectoropt.foptValue)" ref="ulli">
                    <p class="charector-optleft">{{charectoropt.propName}}</p>
                    <p class="charector-optright">{{charectoropt.foptValue}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ParameterCopm",
        props:["seriesid","optIdStr"],
        data(){
            return{
                charector:[],
            }
        },
        watch:{
            /*监听本体规格传入的选项*/
            optIdStr:{
                handler(newVal,oldVal){
                    this.get_charector()
                }
            }
        },
        updated() {
            this.is_Showtit();
        },
        methods:{
            /*得到特性参数所有数据*/
            get_charector(){
                this.
                $axios
                    .get(this.IP+'/get_charector?series_id='+this.seriesid+"&optSet="+this.optIdStr)
                    .then(response => {
                        this.charector = response.data;
                    })
                    .catch(function (err) {
                        console.log('Error')
                    })
            },

            /*判断当li是否为空*/
            is_Showli(foptValue){
                if(foptValue=="null"){
                    return false
                }else{
                    return true
                }
            },

            /*判断当li为空时标题也隐藏*/
            is_Showtit(){
                let titdiv=this.$refs.divall;
                let i=0;
                for(i in titdiv){
                    if(titdiv[i].childNodes[1].childElementCount==0){
                        titdiv[i].style.display="none"
                    }else{
                        titdiv[i].style.display="block"
                    }
                }
            }
        }
    }
</script>

<style scoped>
@import "../assets/css/parameter.css";
</style>