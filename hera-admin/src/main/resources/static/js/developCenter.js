$(function () {

    /**
     * 开发中心zTree初始化配置
     *
     */
    var setting = {
        view: {
            showLine: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parent",
                rootPId: 0

            }
        },
        callback: {
            onRightClick: OnRightClick,
            onClick: leftClick
        }
    };

    /**
     * zTree 右键菜单初始化数据
     */
    var zTree, rMenu;

    /**
     * tab项数据
     *
     * @type {{}}
     */
    var tabObj = {};

    /**
     * 存储在localStorage中的数据
     *
     * @type {Array}
     */

    var tabData = new Array();

    /**
     * 添加的叶子节点个数统计，为重命名统计
     *
     */
    var addCount = 1;

    var zNodes = getDataByPost(base_url + "/developCenter/init.do");

    function leftClick() {
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];
        var name = selected['name'];
        var isParent = selected['isParent'];//true false
        if (isParent == true) {
            return;
        }

        var parameter = "id=" + id;
        var result = null;

        $.ajax({
            url: base_url + "/developCenter/find.do",
            type: "get",
            async: false,
            data: parameter,
            success: function (data) {
                result = data;
            }
        });
        var script = result['content'];
        if(script == null || script == '') {
            script = '开始写脚本';
        }
        $("id").val(id);
        $("#fileScript").text(script);

        var tabDetail = {id: id, text: name, url: "xx", closeable: true, select: 0, fileScript:script};
        tabData = JSON.parse(localStorage.getItem('tabData'));
        var b = isInArray(tabData, tabDetail);
        debugger
        if (b == false) {
            tabData.push(tabDetail);
            tabObj = $("#tabContainer").tabs({
                data: tabDetail,
                showIndex: 0,
                loadAll: true
            });

            $("#tabContainer").data("tabs").addTab(tabDetail);
        } else {
            tabObj = $("#tabContainer").tabs({
                data: tabDetail,
                showIndex: 0,
                loadAll: true
            });
            tabObj = $("#tabContainer").data("tabs").showTab(id);
        }
        localStorage.setItem("tabData", JSON.stringify(tabData));
    }


    $('body').on('click', 'a[data-toggle=\'tab\']', function (e) {
        e.preventDefault()
        var tab_name = this.getAttribute('href')
        if (history.pushState) {
            history.pushState(null, null, tab_name)
        }
        else {
            location.hash = tab_name
        }
        localStorage.setItem('activeTab', tab_name)

        $(this).tab('show');
        return false;
    });


    $("ul#logTab").on("click", "li", function () {
        debugger
        var tableObject = new TableInit();
        tableObject.init();

        var num = $(this).find("a").attr("href");
        if (num == "#tab_2") {
            $("#scriptEditor").attr("style", "display:none");
        } else {
            $("#scriptEditor").attr("style", "display:block");

        }

    });


    function OnRightClick(event, treeId, treeNode) {
        if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            zTree.cancelSelectedNode();
            showRMenu("root", event.clientX, event.clientY);
        } else if (treeNode && !treeNode.noR) {
            zTree.selectNode(treeNode);
            showRMenu("node", event.clientX, event.clientY);
        }
    }


    function showRMenu(type, x, y) {
        $("#rMenu ul").show();
        if (type == "root") {
            $("#removeFile").hide();
        } else {
            $("#addFolder").show();
            $("#addHiveFile").show();
            $("#addShellFile").show();
            $("#rename").show();
            $("#openFile").show();
            $("#removeFile").show();
            $("#copyFile").show();
            $("#resetTree").show();
        }

        y += document.body.scrollTop;
        x += document.body.scrollLeft;

        rMenu.css({"top": y / 2 + "px", "left": x / 2 + "px", "visibility": "visible", position: "absolute"});

        $("body").bind("mousedown", onBodyMouseDown);
    }


    function hideRMenu() {
        $("body").unbind("mousedown", onBodyMouseDown);
    }


    function onBodyMouseDown(event) {
        if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
            rMenu.css({"visibility": "hidden"});
        }
    }

    $("#addFolder").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];
        var name = "文件夹" + addCount;

        var newNode = {name: "文件夹" + addCount, isParent: true};
        addCount++;

        var parameter = "parent=" + parent + "&type=" + "1" + "&name=" + name;

        $.ajax({
            url: base_url + "/developCenter/addFile.do",
            type: "get",
            async: false,
            data: parameter,
            success: function (data) {
                alert(data);
            }
        });

        if (zTree.getSelectedNodes()[0]) {
            newNode.checked = zTree.getSelectedNodes()[0].checked;
            zTree.addNodes(zTree.getSelectedNodes()[0].getParentNode(), newNode);
        }

        fixIcon();//调用修复图标的方法。方法如下：

    });


    $("#addHiveFile").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];
        var name = selected['name'];

        var newNode = {name: +addCount + name, isParent: true};
        addCount++;

        var parameter = "parent=" + parent + "&type=" + "2" + "&name=" + "copy_" + name;

        $.ajax({
            url: "/developCenter/addFile.do",
            type: "get",
            async: false,
            data: parameter,
            success: function (data) {
                alert(data);
            }
        });

        if (zTree.getSelectedNodes()[0]) {
            newNode.checked = zTree.getSelectedNodes()[0].checked;
            zTree.addNodes(zTree.getSelectedNodes()[0].getParentNode(), newNode);
        }

        fixIcon();//调用修复图标的方法。方法如下：

    });


    $("#addShellFile").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];
        var name = selected['name'];

        var newNode = {name: +addCount + name, isParent: true};
        addCount++;

        var parameter = "parent=" + parent + "&type=" + "2" + "&name=" + "copy_" + name;

        $.ajax({
            url: "/developCenter/addFile.do",
            type: "get",
            async: false,
            data: parameter,
            success: function (data) {
                alert(data);
            }
        });

        if (zTree.getSelectedNodes()[0]) {
            newNode.checked = zTree.getSelectedNodes()[0].checked;
            zTree.addNodes(zTree.getSelectedNodes()[0].getParentNode(), newNode);
        }
        fixIcon();//调用修复图标的方法。方法如下：

    });


    $("#rename").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];

    });


    $("#openFile").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];

    });

    $("#removeFile").click(function () {
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parameter = "id=" + id;

        $.ajax({
            url: "/developCenter/delete.do",
            type: "get",
            async: false,
            data: parameter,
            success: function (data) {
                alert(data);
            }
        });

        if (zTree.getSelectedNodes()[0]) {
            newNode.checked = zTree.getSelectedNodes()[0].checked;
            zTree.addNodes(zTree.getSelectedNodes()[0].getParentNode(), newNode);
        }

        fixIcon();//调用修复图标的方法。方法如下：

    });


    $("#copyFile").click(function () {
        hideRMenu();
        var selected = zTree.getSelectedNodes()[0];
        var id = selected['id'];
        var parent = selected['parent'];

    });


    /**
     * 修正zTree的图标，让文件节点显示文件夹图标
     */
    function fixIcon() {
        $.fn.zTree.init($("#documentTree"), setting, zNodes);
        var treeObj = $.fn.zTree.getZTreeObj("documentTree");
        //过滤出sou属性为true的节点（也可用你自己定义的其他字段来区分，这里通过sou保存的true或false来区分）
        var folderNode = treeObj.getNodesByFilter(function (node) {
            return node.isParent
        });
        for (var j = 0; j < folderNode.length; j++) {//遍历目录节点，设置isParent属性为true;
            folderNode[j].isParent = true;
            folderNode[j].directory = 0;
        }
        treeObj.refresh();//调用api自带的refresh函数。
    }


    $("#execute").click(function () {
        debugger
        var fileId = $("#tabContainer").data("tabs").getCurrentTabId();
        var fileScript = $("#fileScript").val();
        var parameter = {
            id: fileId,
            content: fileScript
        };
        var result = null;
        var url = base_url + "/developCenter/debug.do";


        $.ajax({
            url: url,
            type: "post",
            data: JSON.stringify(parameter),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                result = data;
            }
        });

    });

    var TableInit = function () {

        var targetId = $("#tabContainer").data("tabs").getCurrentTabId();
        var parameter = {fileId: targetId};

        var oTableInit = new Object();
        oTableInit.init = function () {
            var table = $('#allLogTable');
            table.bootstrapTable({
                url: base_url + "/developCenter/findDebugHistory",
                queryParams: parameter,
                pagination: true,
                showPaginationSwitch: false,
                search: false,
                cache: false,
                pageNumber: 1,
                pageList: [10, 25, 40, 60],
                columns: [
                    {
                        field: "id",
                        title: "id"
                    }, {
                        field: "fileId",
                        title: "文件id"
                    },
                    {
                        field: "executeHost",
                        title: "执行机器ip"
                    }, {
                        field: "status",
                        title: "状态"
                    }, {
                        field: "startTime",
                        title: "开始时间"
                    }, {
                        field: "endTime",
                        title: "结束时间"
                    },
                    {
                        field: "操作",
                        title: "操作"
                    }
                ],
                detailView: true,
                detailFormatter: function (index, row) {
                    debugger
                    var log = row["log"]['content'];
                    var html = '<form role="form">' + '<div class="form-group">' + '<textarea class="form-control" rows="30" >'
                        + log +
                        '</textarea>' + '<form role="form">' + '<div class="form-group">';
                    return html;
                },

            });
        }
        return oTableInit;
    }

    /**
     * 初始化开发中心页面
     *
     */
    $(document).ready(function () {
        $.fn.zTree.init($("#documentTree"), setting, zNodes);
        zTree = $.fn.zTree.getZTreeObj("documentTree");
        rMenu = $("#rMenu");
        fixIcon();

        var storeData = JSON.parse(localStorage.getItem('tabData'));
        if (storeData != null) {
            for (var i = 0; i < storeData.length; i++) {
                $("#tabContainer").tabs({
                    data: storeData[i],
                    showIndex: 0,
                    loadAll: true
                });
                $("#tabContainer").data("tabs").addTab(storeData[i]);
            }
        } else {
            var tmp = new Array();
            localStorage.setItem("tabData", JSON.stringify(tmp));
        }
    });

});


