package com.dj.app.server;

import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;



public class ApplicationStarter {
	public static void main(String[] args) throws Exception {

		/*
		 * Server server = new Server(9500); Context context = new
		 * Context(server, "/", Context.SESSIONS);
		 *
		 * ServletHolder servletHolder = new ServletHolder(new
		 * DispatcherServlet());
		 * servletHolder.setInitParameter("contextConfigLocation",
		 * "classpath:/WEB-INF/dispatcher-servlet.xml");
		 *
		 * servletHolder.setInitOrder(2); context.addServlet(servletHolder,
		 * "/*");
		 *
		 * server.start(); server.join();
		 *
		 */

		Server server = new Server(9500);
		server.addHandler(new WebAppContext("src/main/webapp", "/finapp"));
		server.start();

    }
}