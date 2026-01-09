$(document).ready(function () {
  
      ///////////////////////////////////// CARICAMENTO PAGINA //////////////////////////////////////////////////

      if (parseInt($("#id_logo").css("width").slice(0, -2)) < 150) {
        $("#id_logo").css("width", "260px");
      }

      if (parseInt($("html").css("width").slice(0, -2)) > 1200) {
        console.log("pc");
        //se sono su pc
        $(".grid-container").css("margin", "0% 5%");
        $("#uno").css("margin-top", "5px");
        $(".subheader").html(
          "<span>DIPARTIMENTO SCIENZE MATEMATICHE, FISICHE E INFORMATICHE</span>"
        );
      } else {
        //se sono su tablet cell
        console.log("smart");
        $(".grid-container").css("margin", "0% 10%");
        $(".subheader").addClass("shp");
      }
      ////////////////////////////////////////////////////////////////////////////////////

      $(".Selection").on({
        click: function () {
          $(location).attr("href", "./SELECTION SORT_files/SELECTION SORT.html");
        },

        mouseenter: function () {
          $(this).css("background-color", "white");
          $(this).css("color", "rgb(68,114,196)");
        },

        mouseleave: function () {
          $(this).css("background-color", "rgb(68,114,196)");
          $(this).css("color", "white");
        },
      });

      $(".Bubble").on({
        click: function () {
          $(location).attr("href", "./BUBBLE SORT_files/BUBBLE SORT.html");
        },

        mouseenter: function () {
          $(this).css("background-color", "white");
          $(this).css("color", "rgb(68,114,196)");
        },

        mouseleave: function () {
          $(this).css("background-color", "rgb(68,114,196)");
          $(this).css("color", "white");
        },
      });

   
});
