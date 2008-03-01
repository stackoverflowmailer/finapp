<%@ include file="/WEB-INF/jsp/taglibs.jsp" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<h5>This is the /WEB-INF/jsp/index.jsp</h5>

<a href="/finapp/classnamemapping.html">Invoke a controller mapped by class name</a><br/>
<a href="/finapp/requestmapping.html">Invoke a controller mapped by an annotation</a><br/>
<a href="javascript:callServer()">Invoke DWR</a><br/>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>
