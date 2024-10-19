plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.10"
    id("org.jetbrains.kotlin.plugin.allopen") version "2.0.10"
    id("io.quarkus")
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
    id("io.gitlab.arturbosch.detekt") version "1.23.7"
    id("org.asciidoctor.jvm.convert") version "4.0.2"
}

repositories {
    mavenCentral()
    mavenLocal()
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project

dependencies {
    implementation(enforcedPlatform("$quarkusPlatformGroupId:$quarkusPlatformArtifactId:$quarkusPlatformVersion"))
    implementation("io.quarkus:quarkus-hibernate-orm-panache")
    implementation("io.quarkus:quarkus-kotlin")
    implementation("io.quarkus:quarkus-arc")
    implementation("io.quarkus:quarkus-rest")
    implementation("io.quarkus:quarkus-rest-jackson")
    implementation("io.quarkus:quarkus-flyway")
    implementation("io.quarkus:quarkus-jdbc-postgresql")
    implementation("io.quarkus:quarkus-hibernate-validator")
    testImplementation("io.quarkus:quarkus-junit5")

    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.0.20")
    testImplementation("io.strikt:strikt-core:0.34.0")
    testImplementation("io.rest-assured:rest-assured:5.5.0")
    testImplementation("io.quarkiverse.mockk:quarkus-junit5-mockk:3.0.0")
    testImplementation("org.testcontainers:postgresql:1.20.2")

    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.7")
}

group = "org.acme"
version = "1.0.0-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}

allOpen {
    annotation("jakarta.ws.rs.Path")
    annotation("jakarta.enterprise.context.ApplicationScoped")
    annotation("jakarta.persistence.Entity")
    annotation("io.quarkus.test.junit.QuarkusTest")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
        javaParameters.set(true)
    }
}

tasks.asciidoctor {
    dependsOn("build")
    setSourceDir("src/main/docs/asciidoc")
    setOutputDir("build/docs/html/asciidoc")
}
