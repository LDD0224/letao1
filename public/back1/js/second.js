$(function () {

  var currentPage = 1;
  var pageSize = 5;
  // 1. 一进入页面, 发送请求, 获取数据进行渲染  
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function ( info ) {
        var htmlStr = template("secondTpl", info);
        $('tbody').html(htmlStr);

        // 进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,
          onbackClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })                
      }
    })
  };


  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 20
      },
      dataType: "json",
      success: function ( info ) {
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });


  // 3. 给下拉菜单的所有 a 添加点击事件, 通过事件委托注册
  $('.dropdown-menu').on("click", "a", function () {
    var txt = $(this).text();
    $('#dropdownText').text( txt );
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });


  // 4. 进行文件上传初始化
  $('#fileupload').fileupload({
    dataType: "json",
    done: function ( e, data ) {
      var result = data.result;
      var picUrl = result.picAddr;
      $('#imgBox img').attr("src", picUrl);
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });


  //  5. 配置表单校验
  $('#form').bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请选择一级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择图片"
          }
        }
      }
    }
  });

})