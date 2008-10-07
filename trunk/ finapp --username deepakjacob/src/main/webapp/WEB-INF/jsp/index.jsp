<html>
<head>

    <title>test </title>
    <link rel="stylesheet" type="text/css"
          href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/css/index.css"/>
</head>

<body>

<div id="loading-mask" style=""></div>
<div id="loading">
    <div class="loading-indicator"><img
            src="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/shared/images/extanim32.gif" width="32"
            height="32"
            style="margin-right:8px;float:left;vertical-align:top;"/>finapp 0.1 - <a
            href="http://extjs.com">the financial application</a><br/><span id="loading-msg">Loading styles and images...</span>
    </div>
</div>

<div id="viewport">


    <div id="bd">
        <div class="left-column">
            <h3>Ext JS 2.0 Samples</h3>
            <br/>

            <div id="sample-spacer" style="height:800px;"></div>


            <link rel="stylesheet" type="text/css"
                  href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/css/ext-all.css"/>
            <!--link rel="stylesheet" type="text/css" href="../resources/css/xtheme-gray.css" /-->
            <link rel="stylesheet" type="text/css"
                  href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/shared/css/extjs.css"/>

            <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Core API...';</script>
            <script type="text/javascript"
                    src="<%=request.getContextPath()%>/js/external/ext-2.0.2/adapter/ext/ext-base.js"></script>
            <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading UI Components...';</script>
            <script type="text/javascript"
                    src="<%=request.getContextPath()%>/js/external/ext-2.0.2/ext-all-debug.js"></script>
            <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initializing...';</script>

            <script type="text/javascript"
                    src="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/shared/site.js"></script>


            <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Remote API...';</script>
            <script type="text/javascript" src="<%=request.getContextPath()%>/dwr/engine.js"></script>
            <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Usercredtials API...';</script>
            <script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/User.js"></script>


            <script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-extensions/objectReader.js"></script>


            <!-- Ext extension dependencies -->
            <script type="text/javascript"
                    src="<%=request.getContextPath()%>/js/external/ext-extensions/DWRSubmit.js"></script>

            <script type="text/javascript"

                    src="<%=request.getContextPath()%>/js/external/ext-extensions/samples.js"></script>

            <div id="login-box">
            </div>

        </div>


        <div style="clear:both"></div>
    </div>
    <!-- end bd -->


</div>
<!-- end viewport -->


        <script type="text/javascript"

                    src="<%=request.getContextPath()%>/js/external/ext-extensions/finappMenuTree.js"></script>


</body>
</html>


    


