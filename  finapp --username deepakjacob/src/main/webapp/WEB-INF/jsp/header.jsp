<%@ include file="/WEB-INF/jsp/taglibs.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
        <meta name="description" content="" />
        <meta name="keywords" content="" />
         <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/css/index.css"/>
        <title>mapping tests</title>
        <script type="text/javascript" src="/finapp/dwr/engine.js"></script>
        <script type="text/javascript" src="/finapp/dwr/interface/Server.js"></script>
        <script type="text/javascript">
            function callServer() {
                Server.echo("DWR", callback);
            }
            function callback(data) {
                alert("Hi from " + data);
            }
        </script>
    </head>
    <body>
