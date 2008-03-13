<%@ include file="/WEB-INF/jsp/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>
    <meta name="description" content=""/>
    <meta name="keywords" content=""/>
    <title>mapping tests</title>

    <link rel="stylesheet" type="text/css"
          href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/css/ext-all.css"/>

    <script type="text/javascript" src="<%=request.getContextPath()%>/dwr/engine.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/Employee.js"></script>
    

    <!-- Ext dependencies -->
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/external/ext-2.0.2/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-2.0.2/ext-all-debug.js"></script>

    <!-- Ext extension dependencies -->
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-extensions/dwrProxy.js"></script>
    <script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-extensions/objectReader.js"></script>

    <!-- DWR dependencies -->
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/external/ext-extensions/finappJsonGrid.js"></script>

        


</head>

<body>
<p>This is /WEB-INF/jsp/testDWRPage.jsp</p>
<a href="javascript:callGetAllEmployees()">Invoke GetAllEmployees DWR</a><br/>

<div id="grid-example"></div>

</body>
</html>