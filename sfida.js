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

      $("#selection").on({
        click: function () {
          $(location).attr("href", "./SELECTION SORT_files/SELECTION SORT.html");
        },
      });

      $("#bubble").on({
        click: function () {
          $(location).attr("href", "./BUBBLE SORT_files/BUBBLE SORT.html");
        },
      });

      $("#zaino").on({
        click: function () {
          $(location).attr("href", "./Zaino_Game/index.html");
        },
      });

      $("#heap").on({
        click: function () {
          $(location).attr("href", "./HEAP SORT_files/HEAP SORT.html");
        },
      });

      $("#labirano").on({
        click: function () {
          $(location).attr("href", "./labirinto/index.html");
        },
      });

   
});
