<%@ include file="/WEB-INF/jsp/taglibs.jsp" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>


<h5>This is the /WEB-INF/jsp/index.jsp</h5>

<a href="/finapp/classnamemapping.html">Invoke a controller mapped by class name</a><br/>
<a href="/finapp/requestmapping.html">Invoke a controller mapped by an annotation</a><br/>
<a href="javascript:callServer()">Invoke DWR</a><br/>


<div id="ajaxForm"></div>

<!-- Ext dependencies -->
<script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-2.0.2/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-2.0.2/ext-all-debug.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/engine.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/dwr/interface/Employee.js"></script>



<!-- Ext extension dependencies -->
<script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-extensions/DWRSubmit.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/external/ext-extensions/finappForm.js"></script>

<link rel="stylesheet" type="text/css"
      href="<%=request.getContextPath()%>/js/external/ext-2.0.2/resources/css/ext-all.css"/>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>
