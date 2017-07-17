/*
 * mSelector
 * Copyright 2017-2020
 * Author: ark1ee.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Project: https://github.com/lfzark/mSelector
 * Version 0.1.0
 */


//TODO Label解决

(function ($) {


    var dataInputDom = null;
    var auto_search = {

        run: function () {

            var run = $('.data-search input[name=searcharea]'), runList = $('.searchList'), ac_menu = $('.searchList .area_menu');
            console.log('auto_search - RUN ' + runList.val() + '=');
            var def_text = mselector_settings.language.search;

            run.val(def_text);
            run.focus(function () { //Focus
                if (this.value == def_text) this.value = '';

            }).blur(function () {   //Lost Focus

                if (this.value === '') this.value = def_text;
                auto_search.delay(function () { runList.hide(); }, 300); //Relay

            }).bind('keyup', function () { //When key up

                auto_search.appRunList(runList, run.val());
            }).keydown(function (e) { //When key down

                if (e.keyCode == 13) setTimeout(auto_search.appRunExec, 200);
            });
        },

        delay: function (f, t) {
            { if (typeof f != "function") return; var o = setTimeout(f, t); this.clear = function () { clearTimeout(o); }; }
        },

        appRunList: function (runList, v) {
            console.log('v==' + v + runList);
            if (v === '') {
                runList.hide();
                return;
            }
            var i, temp = '', n = 0, loaded = {};

            for (i in searchValue) {
                if (isNaN(i) || loaded[i] || !searchValue[i].name) {
                    continue;
                }

                runSearchCode = searchValue[i].code;
                runSearchName = searchValue[i].name;
                runSearchAbbreviate = searchValue[i].abbreviate;

                if (runSearchName.indexOf(v) >= 0 || runSearchAbbreviate.indexOf(v) >= 0 || runSearchAbbreviate.toLowerCase().indexOf(v) >= 0 || runSearchAbbreviate.toUpperCase().indexOf(v) >= 0) {
                    loaded[i] = 1;
                    temp += '<a class="area_menu" href="javascript:;" data-flag=1 data-code="' + runSearchCode + '" data-name="' + runSearchName + '" onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')"><em>' + runSearchAbbreviate.replace(v, "<b>" + v + "</b>") + '</em>' + runSearchName.replace(v, "<b>" + v + "</b>") + '</a>';
                    if (++n > 10) break;
                }
            }
            if (temp) {
                runList.show().html(temp);
            } else {
                runList.hide().html('');
            }
        },

        appRunExec: function () {

            ac_menu = $('.searchList .area_menu');
            if (ac_menu.length > 0) {
                ac_menu.eq(0).trigger('click');
            }
        },
    };


    /////////////////////////////////////////////////////////
    $.fn.mselector = function (options) {
            var __GlobalData = null;
            var mselector_data_array = null;
            var mselector_categories = null;
            var mselector_hotitems = null;
            var mselector_relations = null;
            
            var searchValue = null;
            var runList = null;
            var mselector_settings = null;

            dataInputDom = this;

           var defaults = {
                ajax: null,
                data: null,
                theme: null,
                title: 'M_SELECTOR TITLE',
                size: {
                    width: '700px',
                    height: '350px'
                },
                language: {
                    search: 'Search',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                    all: 'ALL',
                    hot_items: 'Hot Items',
                    all_categories: 'All Catagory',
                    error: '',
                    tips: '<em>Multiple Select</em>'
                },
                max: 200
            };
            mselector_settings = $.extend({}, defaults, options);
            mselector_settings.language = $.extend({}, defaults.language, options.language);
            mselector_settings.size = $.extend({}, defaults.size, options.size);




            $(this).click(function () {
                    //INIT
                if (mselector_settings.ajax) {

                        console.log('ajax:' + mselector_settings.ajax.url + ' BY ' + mselector_settings.ajax.type);
                        if ($.fn.mselector.load_data_ajax(mselector_settings.ajax.url, mselector_settings.ajax.type)===false){
                            console.log('return...');
                            return ;
                        }
                        console.log('FINISH AJAx...');
                        
                }
                else if (mselector_settings.data) {

                } 
                    else {

                
                }
                console.log('=====');
                console.log(mselector_settings);
                console.log(__GlobalData);
                console.log('=====');
                
                $.fn.mselector.separate_data(options,this);
                $.fn.mselector.init();
                

            });
            




        // this.addClass('modal fade');
        // this.attr('tabindex', '-1');
        // this.attr('role', 'dialog');

        return this;
    };

    //Separate Data
    $.fn.mselector.separate_data = function (options,con) {

        mselector_data_array = __GlobalData.list;
        mselector_categories = __GlobalData.category.categories;
        mselector_hotitems = __GlobalData.category.hotitems;
        mselector_relations = __GlobalData.relations;
        dataInputDom = con;
        var defaults = {
                ajax: null,
                data: null,
                theme: null,
                title: 'M_SELECTOR TITLE',
                size: {
                    width: '700px',
                    height: '350px'
                },
                language: {
                    search: 'Search',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                    all: 'ALL',
                    hot_items: 'Hot Items',
                    all_categories: 'All Catagory',
                    error: '',
                    tips: '<em>Multiple Select</em>'
                },
                max: 200
            };
            mselector_settings = $.extend({}, defaults, options);
            mselector_settings.language = $.extend({}, defaults.language, options.language);
            mselector_settings.size = $.extend({}, defaults.size, options.size);



    };
    // ****************
    // FUNCTIONS
    // ****************

    //$.fn.mselector.def_function = function () {

        $.fn.mselector.init = function () {
            console.log('=======init');
            console.log(__GlobalData);
            console.log(mselector_settings);
            var content =
                '<div class="m_selector_box ">' +
                '   <div class="m_selector_box_bg"></div>' +
                '       <div class="m_selector_alert m_selector_outer m_selector_dialog"' +
                '          <div class="m_selector_border" >' +
                '              <div class="m_selector_title_bar m_selector_header">' +
                '                  <div class="m_selector_title">mSelector Title | PoC Selector</div>' +
                '                  <a href="javascript:;" class="m_selector_close "  onclick="$.fn.mselector.close_it();">×</a>' +
                '              </div>' +
                '              <div class="m_selector_main">' +
                '                   <div class="m_selector_content" style="padding: 0px; position:relative">' +
                '                       <div class="m_selector_data_content" id="" >' +
                '                           <div class="data-result"><em>You can chose <strong>2000</strong> item(s).</em></div>' +
                '                           <div class="data-error" style="display: none;">error msg</div>' +
                '                           <div class="data-search" id="searchRun"> <input class="run" name="searcharea"/><div class="searchList run"></div></div>' +
                '                           <div class="data-tabs">' +
                '                               <ul>' +
                '                                   <li onclick="$.fn.mselector.removenode_area(this)" data-selector="tab-all" class="active"><a href="javascript:;"><span>' + mselector_settings.language.all + '</span></a></li>' +
                '                               </ul>' +
                '                           </div>' +
                '                           <div class="data-container data-container-items">' +
                '                           </div>' +
                '                       </div>' +
                '                   </div>' +
                '              </div>' +
                '              <div class="m_selector_footer">' +
                '                 <div class="m_selector_buttons">' +
                '                   <button class="m_selector-btn m_selector-btn-primary " type="button" onclick="$.fn.mselector.select_it();">' + mselector_settings.language.confirm + '</button>' +
                '                   <button class="m_selector-btn m_selector-btn-primary " type="button" onclick="$.fn.mselector.close_it();">' + mselector_settings.language.cancel + '</button>' +
                '                 </div>' +
                '              </div>' +
                '          </div>' +
                '      </div>' +
                '</div>';

            $('body').append(content);

            $('.data-result').html(mselector_settings.language.tips);
            
            if (mselector_settings.theme) {

                $('.m_selector_box').addClass('mselector_black');

            }
            if (mselector_settings.title) {

                $('.m_selector_title').html(mselector_settings.title);

            }
            if (mselector_settings.size) {
                if (mselector_settings.size.width) {
                    $('.m_selector_data_content').css('width', mselector_settings.size.width);
                }
                if (mselector_settings.size.height) {
                    $('.data-container').css('height', mselector_settings.size.height);
                }
            }



            var item_list = '';
            item_list += '<div class="view-all" id="">';
            item_list += '  <p class="data-title">' + mselector_settings.language.hot_items + '</p>';
            item_list += '    <div class="data-list data-list-hot">';
            item_list += '      <ul class="clearfix">';

            for (var i in mselector_hotitems) {
                item_list += '<li><a href="javascript:;" data-code="' + mselector_hotitems[i] + '" data-name="' + mselector_data_array[mselector_hotitems[i]][0] + '" class="d-item"  onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')">' + mselector_data_array[mselector_hotitems[i]][0] + '<label>0</label></a></li>';
            }

            item_list += '      </ul>';
            item_list += '    </div>';
            item_list += '    <p class="data-title">' + mselector_settings.language.hot_items + '</p>';
            item_list += '   <div class="data-list data-list-categories">';
            item_list += '  <ul class="clearfix">';

            for (var i in mselector_categories) {
                item_list += '<li><a href="javascript:;" data-code="' + mselector_categories[i] + '" data-name="' + mselector_data_array[mselector_categories[i]][0] + '" class="d-item"  onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')">' + mselector_data_array[mselector_categories[i]][0] + '<label>0</label></a></li>';
            }
            item_list += ' </ul>';
            item_list += '</div>';

            $('.data-container-items').html(item_list);

            var minwid = document.documentElement.clientWidth;

            $('.m_selector_outer .m_selector_header').on("mousedown", function (e) {
                //$(this)[0].onselectstart = function(e) { return false; };//防止拖动窗口时，会有文字被选中的现象(事实证明不加上这段效果会更好)
                $(this)[0].oncontextmenu = function (e) { return false; }; //防止右击弹出菜单
                var getStartX = e.pageX;
                var getStartY = e.pageY;
                var getPositionX = (minwid / 2) - $(this).offset().left,
                    getPositionY = 60;
                $(document).on("mousemove", function (e) {
                    var getEndX = e.pageX;
                    var getEndY = e.pageY;
                    $('.m_selector_outer').css({
                        left: getEndX - getStartX - getPositionX,
                        top: getEndY - getStartY + getPositionY
                    });
                });
                $(document).on("mouseup", function () {
                    $(document).unbind("mousemove");
                });
            });
            $.fn.mselector.selectCategory('all', null, '');
            searchValue = $.fn.mselector.searchdata();
            auto_search.run();
        };

        //Close Dialog Box
        $.fn.mselector.close_it = function () {
            $('.m_selector_box').remove();

        };

        //Select Items & Close Dialog Box
        $.fn.mselector.select_it = function () {
            console.log(dataInputDom);
            var val = '';
            var item_name = '';
            var item_id_list = [];

            if ($('.save_box').length > 0) {
                $('.save_box').each(function () {
                 
                    if(!!mselector_relations[$(this).data("code")]){
                         //item_id_list.concat(mselector_relations[$(this).data("code")]); WHY
                         item_id_list.push.apply(item_id_list,mselector_relations[$(this).data("code")]);  
                          
                         console.log(item_id_list);
                    }else{
                         item_id_list.push($(this).data("code").toString() );
                    }
                    val += $(this).data("code") + ',';
                    item_name += $(this).data("name") + '-';
                });
            }

            item_id_list=item_id_list.map(function(data){  
                return parseInt(data);  
            });  

            $.unique(item_id_list); 

            //tem_id_list = item_id_list.sort();

 
            if (val !== '') {
                val = val.substring(0, val.lastIndexOf(','));
            }
            console.log(item_id_list + '  ==== SELECTION');
            if (item_name !== '') {
                item_name = item_name.substring(0, item_name.lastIndexOf('-'));
            }

            $(dataInputDom).data("value", val);
            $(dataInputDom).attr("item_id_list", item_id_list);

            $(dataInputDom).val(item_name);
            $.fn.mselector.close_it();

        };


        $.fn.mselector.removespan_area = function (spanthis) {
            console.log('removespan_area');
            var reverse_relations = [];

            for (var key in mselector_relations) {
                for (var item_k in mselector_relations[key]) {
                    if (mselector_relations[key][item_k] !== '' && mselector_relations[key][item_k] !== null) {
                        reverse_relations[mselector_relations[key][item_k].toString()] = key;
                    }
                }


            }

            $('a[data-code=' + $(spanthis).data("code") + ']').removeClass('d-item-active');
            if ($('a[data-code=' + $(spanthis).data("code") + ']').length > 0) {
                if ($('a[data-code=' + $(spanthis).data("code") + ']').attr("class").indexOf('data-all') > 0) {
                    $('a[data-code=' + $(spanthis).data("code") + ']').parent('li').nextAll('li').find('a').removeClass('mselector_disable');
                    $('a[data-code=' + $(spanthis).data("code") + ']').parent('li').nextAll("li").find('a').attr("onclick", '$.fn.mselector.selectCategory("sub",this,"")');
                }
            }

            if ($('.data-list-categories a[data-code=' + reverse_relations[$(spanthis).data("code").toString()] + ']').length > 0) {

                var numlabel = $('.data-list-categories a[data-code=' + reverse_relations[$(spanthis).data("code").toString()] + ']').find('label').text();
                if (parseInt(numlabel) == 1) {
                    $('.data-list-categories a[data-code=' + reverse_relations[$(spanthis).data("code").toString()] + ']').find('label').text(0).hide();
                } else {
                    $('.data-list-categories a[data-code=' + reverse_relations[$(spanthis).data("code").toString()] + ']').find('label').text(parseInt(numlabel) - 1);
                }
            }
            $(spanthis).remove();
        };

        $.fn.mselector.selectitem_area = function selectitem_area(con) {
            console.log('select item_ a category called');

            if ($('.data-result span').length > 5) {
                $('.data-error').slideDown();
                setTimeout("$('.data-error').hide()", 1000);
                return false;
            } else {

                $('.data-result span').each(function () {
                    if ($(this).data("code").toString().substring(0, $(con).data("code").toString().length) == $(con).data("code").toString()) {
                        $(this).remove();
                    }
                });

                $(con).parent('li').siblings('li').find("a").removeClass("d-item-active");

                // Disable Category - Items Btns
                if ($(con).attr("class").indexOf("d-item-active") == -1) {

                    $(con).parent('li').nextAll("li").find('a').addClass('mselector_disable');

                    $(con).parent('li').nextAll("li").find('a').attr("onclick", "");

                } else {

                    $(con).parent('li').nextAll("li").find('a').removeClass('mselector_disable');

                    $(con).parent('li').nextAll("li").find('a').attr("onclick", '$.fn.mselector.selectCategory("sub",this,"")');

                }
                if ($(con).attr("class").indexOf('d-item-active') > 0) {
                    $('.data-result span[data-code="' + $(con).data("code") + '"]').remove();
                    $(con).removeClass('d-item-active');
                    return false;
                }
                //Change Btn Event
                $('.data-result').append('<span class="save_box mselector-titlespan" data-code="' + $(con).data("code") + '" data-name="' + $(con).data("name") + '" onclick="$.fn.mselector.removespan_area(this)">' + $(con).data("name") + '<i>×</i></span>');
                $(con).addClass('d-item-active');

            }

        };


        $.fn.mselector.selectCategory = function (type, con, isremove) {
            console.log('selectCategory');

            var c_itemlist = "";
            if (type == "all") {
                console.log('type=all');
                var mselector_categories = __GlobalData.category.categories;

                var mselector_hotitems = __GlobalData.category.hotitems;
                var reverse_relations = [];

                for (var key in mselector_relations) {
                    for (var item_k in mselector_relations[key]) {
                        if (mselector_relations[key][item_k] !== '' && mselector_relations[key][item_k] !== null) {
                            reverse_relations[mselector_relations[key][item_k].toString()] = key;
                        }
                    }


                }
                // Load Hot Items and Categories

                c_itemlist += '<div class="view-all" id="">';
                c_itemlist += '  <p class="data-title">' + mselector_settings.language.hot_items + '</p>';
                c_itemlist += '    <div class="data-list data-list-hot">';
                c_itemlist += '      <ul class="clearfix">';

                for (var i in mselector_hotitems) {
                    c_itemlist += '<li><a href="javascript:;" data-code="' + mselector_hotitems[i] + '" data-name="' + mselector_data_array[mselector_hotitems[i]][0] + '" class="d-item"  onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')">' + mselector_data_array[mselector_hotitems[i]][0] + '<label>0</label></a></li>';
                }

                c_itemlist += '      </ul>';
                c_itemlist += '    </div>';
                c_itemlist += '    <p class="data-title">' + mselector_settings.language.all_categories + '</p>';
                c_itemlist += '   <div class="data-list data-list-categories">';
                c_itemlist += '   <ul class="clearfix">';

                for (var i in mselector_categories) {
                    c_itemlist += '<li><a href="javascript:;" data-code="' + mselector_categories[i] + '" data-name="' + mselector_data_array[mselector_categories[i]][0] + '" class="d-item"  onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')">' + mselector_data_array[mselector_categories[i]][0] + '<label>0</label></a></li>';
                }
                c_itemlist += ' </ul>';
                c_itemlist += '</div>';

                $('.data-container-items').html(c_itemlist);

                $('.data-result span').each(function (index) {


                    if ($('a[data-code=' + $(this).data("code") + ']').length > 0) {

                        $('a[data-code=' + $(this).data("code") + ']').addClass('d-item-active');

                        if ($('a[data-code=' + $(this).data("code") + ']').attr("class").indexOf('data-all') > 0) {
                            //addClass('mselector_disable');
                            $('a[data-code=' + $(this).data("code") + ']').parent('li').nextAll('li').find('a').addClass('mselector_disable');
                            $('a[data-code=' + $(this).data("code") + ']').parent('li').nextAll("li").find('a').attr("onclick", "");

                        } else {
                            if ($('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').length > 0) {
                                var numlabel = $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text();
                                console.log('numlabel==' + numlabel);
                                $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text(parseInt(numlabel) + 1).show();
                            }
                        }
                    } else {
                        var numlabel = $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text();
                        console.log('-----------------------------------' + numlabel);
                        $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text(parseInt(numlabel) + 1).show();
                    }
                });
            }

            else {
                var mselector_categories = __GlobalData.category.categories;
                var relations = __GlobalData.relations;
                var reverse_relations = [];

                for (var key in relations) {
                    for (var item_k in relations[key]) {
                        if (relations[key][item_k] !== '' && relations[key][item_k] !== null) {
                            reverse_relations[relations[key][item_k].toString()] = key;
                        }
                    }


                }
                console.log('reverse_relations');
                if (typeof (relations[$(con).data("code")]) != "undefined") {

                    //Add Tab Title
                    if (isremove != "remove") {
                        $('.data-tabs li').each(function () {
                            $(this).removeClass('active');
                        });
                        $('.data-tabs ul').append('<li data-code=' + $(con).data("code") + ' data-name=' + $(con).data("name") + ' class="active" onclick="$.fn.mselector.removenode_area(this)"><a href="javascript:;"><span>' + $(con).data("name") + '</span><em></em></a></li>');
                    }

                    //Add Category Name and Itemlist
                    c_itemlist += '<ul class="clearfix">';

                    c_itemlist += '<li class="" style="width:100%"><a href="javascript:;" class="d-item data-all"  data-code="' + $(con).data("code") + '"  data-name="' + $(con).data("name") + '"  onclick="$.fn.mselector.selectitem_area(this)">' + $(con).data("name") + '<label>0</label></a></li>';

                    for (var i in relations[$(con).data("code")]) {
                        c_itemlist += '<li><a href="javascript:;" class="d-item" data-code="' + relations[$(con).data("code")][i] + '"  data-name="' + mselector_data_array[relations[$(con).data("code")][i]][0] + '" onclick="$.fn.mselector.selectCategory(\'sub\',this,\'\')">' + mselector_data_array[relations[$(con).data("code")][i]][0] + '<label>0</label></a></li>';
                    }
                    c_itemlist += '</ul>';
                    console.log('show a category itemlist');
                    $('.data-container-items').html(c_itemlist);

                } else {

                    console.log('single select a item');
                    console.log($('.data-result span[data-code="' + $(con).data("code") + '"]').length);

                    //No Selection ,Don't do anything.
                    if (typeof $(con).data('flag') != 'undefined') {
                        if ($('.data-result span[data-code="' + $(con).data("code") + '"]').length > 0) {
                            return false;
                        }
                    }

                    // when an item is active
                    if ($(con).attr("class").indexOf('d-item-active') > 0) {
                        console.log('an item ==active');
                        $('.data-result span[data-code="' + $(con).data("code") + '"]').remove();
                        //Disable item
                        $(con).removeClass('d-item-active');
                        // 分类显示选项数量减一,当为0时不显示
                        console.log(reverse_relations[$(con).data("code").toString()]);
                        console.log($('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').length);
                        console.log('number--' + $('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').length + '--' + $(con).data("code").toString().substring(0, 3));

                        if ($('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').length > 0) {

                            var numlabel = $('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').find('label').text();

                            if (parseInt(numlabel) == 1) {
                                $('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').find('label').text(0).hide();
                            } else {
                                $('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').find('label').text(parseInt(numlabel) - 1);
                            }
                        }
                        return false;

                    } else {
                        // Choose category
                        if ($('.data-list-categories a[data-code=' + reverse_relations[$(con).data("code").toString()] + ']').hasClass('d-item-active')) {
                            $('.data-error').text('Already Choose Category.');
                            $('.data-error').slideDown();
                            setTimeout("$('.data-error').text('3 at most.').hide()", 1000);
                            return false;
                        }
                    }
                    if ($('.data-result span').length > 2000) {
                        $('.data-error').slideDown();
                        setTimeout("$('.data-error').hide()", 1000);
                        return false;
                    } else {
                        $('.data-result').append('<span class="save_box mselector-titlespan" data-code="' + $(con).data("code") + '" data-name="' + $(con).data("name") + '" onclick="$.fn.mselector.removespan_area(this)">' + $(con).data("name") + '<i>×</i></span>');
                        $(con).addClass('d-item-active');
                    }

                }

                $('.data-result span').each(function () {
                    $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text(0).hide();
                });

                $('.data-result span').each(function () {
                    if ($('a[data-code=' + $(this).data("code") + ']').length > 0) {
                        $('a[data-code=' + $(this).data("code") + ']').addClass('d-item-active');
                        if ($('a[data-code=' + $(this).data("code") + ']').attr("class").indexOf('data-all') > 0) {

                            $('a[data-code=' + $(this).data("code") + ']').parent('li').nextAll('li').find('a').addClass('mselector_disable');
                            $('a[data-code=' + $(this).data("code") + ']').parent('li').nextAll("li").find('a').attr("onclick", "");

                        } else {

                            $('.data-list-categories a').each(function () {
                                $(this).find('label').text(0).hide();
                            });


                        }
                    } else {
                        // console.log('============================');
                        // console.log($(this).data("code").toString().substring(0, 3) + ']');
                        var numlabel = $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text();
                        $('.data-list-categories a[data-code=' + reverse_relations[$(this).data("code").toString()] + ']').find('label').text(parseInt(numlabel) + 1).show();
                    }
                });
            }
        };

        $.fn.mselector.removenode_area = function (lithis) {

            $(lithis).siblings().removeClass('active');
            $(lithis).addClass('active');

            if ($(lithis).nextAll('li').length === 0) {
                return false;
            }
            $(lithis).nextAll('li').remove();

            if ($(lithis).data("selector") == "tab-all") {
                $.fn.mselector.selectCategory('all', null, '');
            } else {
                $.fn.mselector.selectCategory('sub', lithis, 'remove');
            }
        };



        $.fn.mselector.searchdata = function () {
            var list = __GlobalData.list;
            var dataArr = [];
            for (var i in list) {
                var temp = {};
                temp.code = i;
                temp.name = list[i][0];
                temp.abbreviate = list[i][1];
                dataArr.push(temp);
            }
            return dataArr;
        };
   // };
    


    //Load Data By Data Structure
    $.fn.mselector.load_data = function (data) {
        if (data) {
            __GlobalData = data;
            $.fn.mselector.separate_data();
            $.fn.mselector.def_function();
            $.fn.mselector.init();
            console.log('DATA LOAD SUCCESSFULLY');
        } else {
            console.log('DATA LOAD FAILED');
        }

    };

    //Load Data By Ajax
    $.fn.mselector.load_data_ajax = function (url, method_type) {

        method_type = method_type || 'GET'; //JS默认参数方式之一

        $.ajax({
            type: method_type,
            url: url,
            dataType: 'JSON',
            async: false,
            success: function (data) {
                __GlobalData = data;
                console.log('DATA AJAX LOAD SUCCESSFULLY');
                return true;
            },
            error: function (data) {
                
                console.log('DATA AJAX LOAD FAIL');
                return false;
            }

        });


    };



})(jQuery);

